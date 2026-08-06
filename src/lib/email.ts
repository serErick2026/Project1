const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";
const FROM_EMAIL =
  process.env.FROM_EMAIL ?? "Feedback Platform <onboarding@resend.dev>";

export async function sendOtpEmail(
  to: string,
  code: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!RESEND_API_KEY) {
    console.log(`[dev] OTP for ${to}: ${code}`);
    return { ok: true };
  }

  const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
      <h2 style="margin: 0 0 12px; color: #111827;">Your verification code</h2>
      <p style="margin: 0 0 16px; color: #374151;">Use this code to verify your email and submit your feedback. It expires in 10 minutes.</p>
      <p style="font-size: 32px; font-weight: 700; letter-spacing: 8px; margin: 0 0 16px; color: #111827;">${code}</p>
      <p style="margin: 0; font-size: 12px; color: #6b7280;">If you did not request this code, you can safely ignore this email.</p>
    </div>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        subject: "Your verification code",
        html,
      }),
    });

    if (!res.ok) {
      return { ok: false, error: "Could not send the code. Please try again." };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not send the code. Please try again." };
  }
}
