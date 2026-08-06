import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feedback & Suggestions",
  description: "File a feedback or track an existing ticket.",
};

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="mt-4 font-cursive text-6xl text-gray-900">
        Tell us and we will act on it.
      </h1>
      <p
        className="mt-3 max-w-xl text-sm italic text-gray-800"
        style={{ fontFamily: "'Times New Roman', Times, serif" }}
      >
        dahil gusto ka namin marinig
      </p>

      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
        <Link
          href="/file"
          className="rounded-full bg-moss-600 px-6 py-3 text-lg font-semibold text-white transition hover:bg-moss-700"
        >
          File a feedback
        </Link>

        <Link
          href="/track"
          className="rounded-full bg-white/60 px-6 py-3 text-lg font-semibold text-gray-900 backdrop-blur-sm transition hover:bg-white/80"
        >
          Track my ticket
        </Link>
      </div>
    </main>
  );
}
