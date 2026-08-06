"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { createFeedback, sendOtp, verifyOtp, type ActionResult } from "@/app/actions";
import { CHALLENGE_QUESTIONS, NATURES } from "@/lib/constants";

const RESEND_SECONDS = 60;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClass =
  "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none";

export function SubmitFeedbackForm() {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(
    createFeedback,
    null
  );
  const formRef = useRef<HTMLFormElement>(null);

  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpMessage, setOtpMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [otpVerified, setOtpVerified] = useState(false);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const [challenge, setChallenge] = useState(() => {
    const index = Math.floor(Math.random() * CHALLENGE_QUESTIONS.length);
    return { index, question: CHALLENGE_QUESTIONS[index].question };
  });

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = setInterval(() => setResendIn((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [resendIn]);

  if (state?.success) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <p className="text-3xl" aria-hidden="true">
          ✓
        </p>
        <h2 className="mt-2 text-lg font-semibold text-emerald-900">Feedback submitted!</h2>
        <p className="mt-1 text-sm text-emerald-800">
          Save your ticket number to track its status:
        </p>
        <p className="mt-3 text-2xl font-bold tracking-widest text-emerald-900">
          {state.ticketNumber}
        </p>
        <Link
          href={`/track/${state.ticketNumber}`}
          className="mt-4 inline-block rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Track this ticket
        </Link>
        <button
          onClick={() => {
            formRef.current?.reset();
            setEmail("");
            setOtpCode("");
            setOtpVerified(false);
            setOtpMessage(null);
            setResendIn(0);
          }}
          className="mt-2 block w-full text-sm text-emerald-700 hover:underline"
        >
          Submit another
        </button>
      </div>
    );
  }

  function handleEmailChange(value: string) {
    setEmail(value);
    setOtpVerified(false);
    setOtpMessage(null);
  }

  async function handleSendCode() {
    if (!EMAIL_RE.test(email.trim())) {
      setOtpMessage({ ok: false, text: "Enter a valid email address first." });
      return;
    }
    setSending(true);
    setOtpMessage(null);
    setOtpVerified(false);
    const res = await sendOtp(email);
    setSending(false);
    if (res.ok) {
      setOtpMessage({ ok: true, text: res.message });
      setResendIn(RESEND_SECONDS);
    } else {
      setOtpMessage({ ok: false, text: res.error });
    }
  }

  async function handleVerify() {
    if (!otpCode.trim()) {
      setOtpMessage({ ok: false, text: "Enter the code you received." });
      return;
    }
    setVerifying(true);
    const res = await verifyOtp(email, otpCode);
    setVerifying(false);
    if (res.ok) {
      setOtpVerified(true);
      setOtpMessage({ ok: true, text: res.message });
    } else {
      setOtpMessage({ ok: false, text: res.error });
    }
  }

  return (
    <form ref={formRef} action={action} className="space-y-4">
      <div>
        <label htmlFor="fullname" className="block text-sm font-medium">
          Full name <span className="text-gray-400">(Optional)</span>
        </label>
        <input
          id="fullname"
          name="fullname"
          type="text"
          maxLength={100}
          placeholder="Your name"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="cellphone" className="block text-sm font-medium">
          Cellphone number <span className="text-gray-400">(Optional)</span>
        </label>
        <input
          id="cellphone"
          name="cellphone"
          type="tel"
          maxLength={20}
          placeholder="09XX XXX XXXX"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email address <span className="text-gray-400">(for verification)</span>
        </label>
        <div className="mt-1 flex gap-2">
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={200}
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleSendCode}
            disabled={sending || resendIn > 0 || otpVerified}
            className="shrink-0 rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 disabled:opacity-50"
          >
            {sending ? "Sending..." : resendIn > 0 ? `Resend in ${resendIn}s` : otpVerified ? "Verified" : "Send code"}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="otp" className="block text-sm font-medium">
          OTP code
        </label>
        <div className="mt-1 flex gap-2">
          <input
            id="otp"
            name="otp"
            type="text"
            inputMode="numeric"
            required
            maxLength={6}
            value={otpCode}
            onChange={(e) => {
              setOtpCode(e.target.value.replace(/\D/g, ""));
              setOtpMessage(null);
            }}
            disabled={otpVerified}
            placeholder="6-digit code"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none disabled:bg-gray-50"
          />
          <button
            type="button"
            onClick={handleVerify}
            disabled={verifying || otpVerified || !otpCode}
            className="shrink-0 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {verifying ? "Checking..." : otpVerified ? "Verified" : "Verify"}
          </button>
        </div>
        {otpMessage && (
          <p
            className={`mt-1 text-xs ${otpMessage.ok ? "text-emerald-600" : "text-red-600"}`}
            role="status"
          >
            {otpMessage.text}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="district" className="block text-sm font-medium">
          District <span className="text-gray-400">(Optional)</span>
        </label>
        <input
          id="district"
          name="district"
          type="text"
          maxLength={100}
          placeholder="e.g. Quezon City District II"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="schoolOffice" className="block text-sm font-medium">
          Name of School/Office this concern is about
        </label>
        <input
          id="schoolOffice"
          name="schoolOffice"
          type="text"
          required
          maxLength={200}
          placeholder="e.g. Mabini Elementary School"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="nature" className="block text-sm font-medium">
          Nature of Request
        </label>
        <select
          id="nature"
          name="nature"
          required
          defaultValue="complaint"
          className={inputClass}
        >
          {NATURES.map((n) => (
            <option key={n.value} value={n.value}>
              {n.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium">
          Description and details
        </label>
        <textarea
          id="description"
          name="description"
          required
          maxLength={4000}
          rows={5}
          placeholder="Tell us what happened, what you'd like to see, or what you appreciate..."
          className={inputClass}
        />
      </div>

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
        <label htmlFor="challengeAnswer" className="block text-sm font-medium">
          Human verification
        </label>
        <p className="mt-1 text-sm text-gray-700">{challenge.question}</p>
        <input type="hidden" name="challengeIndex" value={challenge.index} />
        <input
          id="challengeAnswer"
          name="challengeAnswer"
          type="text"
          required
          autoComplete="off"
          placeholder="Your answer"
          className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
        />
      </div>

      {state && !state.success && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {state.error}
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={pending || !otpVerified}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {pending ? "Submitting..." : "Submit feedback"}
        </button>
        {!otpVerified && (
          <p className="mt-2 text-center text-xs text-gray-500">
            Enter the OTP sent to your email to enable submission.
          </p>
        )}
      </div>
    </form>
  );
}
