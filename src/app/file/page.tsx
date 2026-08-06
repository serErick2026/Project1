import Link from "next/link";
import type { Metadata } from "next";
import { SubmitFeedbackForm } from "@/components/SubmitFeedbackForm";

export const metadata: Metadata = {
  title: "File a feedback",
};

export default function FileFeedbackPage() {
  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 py-12">
      <Link href="/" className="text-sm font-medium text-gray-900 hover:text-gray-700">
        &larr; Back to home
      </Link>
      <h1 className="mt-3 text-2xl font-bold text-gray-900">File a feedback</h1>
      <p className="mt-1 text-sm text-gray-800">
        Fill this in and we&apos;ll give you a ticket number to track its status.
      </p>
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <SubmitFeedbackForm />
      </div>
    </main>
  );
}
