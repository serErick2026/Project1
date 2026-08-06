"use server";

import { withConnection } from "@/lib/db";
import { Feedback, Otp, NATURES, type FeedbackNature } from "@/lib/models";
import { sendOtpEmail } from "@/lib/email";
import { CHALLENGE_QUESTIONS } from "@/lib/constants";

export type ActionResult =
  | { success: true; ticketNumber: string }
  | { success: false; error: string };

export type OtpResult =
  | { ok: true; message: string }
  | { ok: false; error: string };

const TICKET_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const OTP_TTL_MS = 10 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;

function generateTicketNumber(): string {
  const buffer = crypto.getRandomValues(new Uint32Array(6));
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += TICKET_CHARS[buffer[i] % TICKET_CHARS.length];
  }
  return `FB-${code}`;
}

function generateOtpCode(): string {
  return String(Math.floor(100000 + crypto.getRandomValues(new Uint32Array(1))[0] % 900000));
}

async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function sendOtp(emailRaw: string): Promise<OtpResult> {
  const email = normalizeEmail(emailRaw ?? "");
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "Enter a valid email address." };
  }

  const code = generateOtpCode();
  const codeHash = await sha256(`${email}:${code}`);

  const saved = await withConnection(async () => {
    const existing = await Otp.findOne({ email }).sort({ createdAt: -1 });
    if (existing && existing.createdAt.getTime() > Date.now() - RESEND_COOLDOWN_MS) {
      return { ok: false as const, error: "Please wait a moment before requesting a new code." };
    }
    await Otp.deleteMany({ email });
    await Otp.create({
      email,
      codeHash,
      expiresAt: new Date(Date.now() + OTP_TTL_MS),
      verified: false,
    });
    return { ok: true as const };
  });

  if (!saved.ok) return saved;

  const sent = await sendOtpEmail(email, code);
  if (!sent.ok) {
    await withConnection(async () => {
      await Otp.deleteMany({ email });
    });
    return { ok: false, error: sent.error };
  }

  return { ok: true, message: `Code sent to ${email}.` };
}

export async function verifyOtp(emailRaw: string, codeRaw: string): Promise<OtpResult> {
  const email = normalizeEmail(emailRaw ?? "");
  const code = String(codeRaw ?? "").trim();
  if (!EMAIL_RE.test(email) || !code) {
    return { ok: false, error: "Enter your email and the code." };
  }

  const codeHash = await sha256(`${email}:${code}`);

  return withConnection(async () => {
    const otp = await Otp.findOne({ email });
    if (!otp || otp.expiresAt.getTime() < Date.now()) {
      return { ok: false as const, error: "Code has expired. Request a new one." };
    }
    if (otp.codeHash !== codeHash) {
      return { ok: false as const, error: "Incorrect code. Please try again." };
    }
    if (!otp.verified) {
      otp.verified = true;
      await otp.save();
    }
    return { ok: true as const, message: "Email verified." };
  });
}

export async function createFeedback(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const fullname = String(formData.get("fullname") ?? "").trim();
  const cellphone = String(formData.get("cellphone") ?? "").trim();
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const district = String(formData.get("district") ?? "").trim();
  const schoolOffice = String(formData.get("schoolOffice") ?? "").trim();
  const rawNature = String(formData.get("nature") ?? "");
  const description = String(formData.get("description") ?? "").trim();
  const challengeIndex = Number(formData.get("challengeIndex") ?? -1);
  const challengeAnswer = String(formData.get("challengeAnswer") ?? "").trim();

  const nature: FeedbackNature | "" = NATURES.some((n) => n.value === rawNature)
    ? (rawNature as FeedbackNature)
    : "";

  if (!EMAIL_RE.test(email)) return { success: false, error: "Enter a valid email address." };
  if (!schoolOffice) return { success: false, error: "Name of School/Office is required." };
  if (!nature) return { success: false, error: "Select a Nature of Request." };
  if (!description) return { success: false, error: "Description is required." };
  if (fullname.length > 100)
    return { success: false, error: "Full name must be 100 characters or fewer." };
  if (cellphone.length > 20)
    return { success: false, error: "Cellphone number must be 20 characters or fewer." };
  if (district.length > 100)
    return { success: false, error: "District must be 100 characters or fewer." };
  if (schoolOffice.length > 200)
    return { success: false, error: "School/Office must be 200 characters or fewer." };
  if (description.length > 4000)
    return { success: false, error: "Description must be 4000 characters or fewer." };

  const challenge = CHALLENGE_QUESTIONS[challengeIndex];
  if (!challenge) return { success: false, error: "Please answer the verification question." };
  if (challengeAnswer.toLowerCase() !== challenge.answer.toLowerCase()) {
    return { success: false, error: "Incorrect answer to the verification question." };
  }

  return withConnection(async () => {
    const otp = await Otp.findOne({ email });
    if (!otp || !otp.verified || otp.expiresAt.getTime() < Date.now()) {
      return { success: false, error: "Please verify your email with the OTP code first." };
    }

    for (let attempt = 0; attempt < 5; attempt++) {
      const ticketNumber = generateTicketNumber();
      try {
        await Feedback.create({
          ticketNumber,
          fullname: fullname || undefined,
          cellphone: cellphone || undefined,
          email,
          emailVerified: true,
          district: district || undefined,
          schoolOffice,
          nature,
          description,
        });
        await Otp.deleteOne({ email });
        return { success: true, ticketNumber };
      } catch (err) {
        if (err && typeof err === "object" && "code" in err && (err as { code?: number }).code === 11000) {
          continue;
        }
        throw err;
      }
    }

    return { success: false, error: "Could not save feedback. Please try again." };
  });
}
