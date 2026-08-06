"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import { createFeedback, type ActionResult } from "@/app/actions";
import { CATEGORIES } from "@/lib/constants";

export function SubmitFeedbackForm() {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(
    createFeedback,
    null
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  if (state?.success) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <p className="text-3xl" aria-hidden="true">
          ✓
        </p>
        <h2 className="mt-2 text-lg font-semibold text-emerald-900">
          Feedback submitted!
        </h2>
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
          onClick={() => formRef.current?.reset()}
          className="mt-2 block w-full text-sm text-emerald-700 hover:underline"
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} action={action} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={120}
          placeholder="A short, clear summary"
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium">
          Category
        </label>
        <select
          id="category"
          name="category"
          defaultValue="general"
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          maxLength={2000}
          rows={5}
          placeholder="Tell us more..."
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
        />
      </div>

      {state && !state.success && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {pending ? "Submitting..." : "Submit feedback"}
      </button>
    </form>
  );
}
