import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { withConnection } from "@/lib/db";
import { Feedback } from "@/lib/models";
import { StatusBadge } from "@/components/StatusBadge";
import { NatureBadge } from "@/components/NatureBadge";

export async function generateMetadata({ params }: PageProps<"/track/[ticket]">): Promise<Metadata> {
  const { ticket } = await params;
  return { title: `Ticket ${ticket.toUpperCase()}` };
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function TicketPage({ params }: PageProps<"/track/[ticket]">) {
  const { ticket } = await params;
  const ticketNumber = ticket.trim().toUpperCase();

  const feedback = await withConnection(async () => Feedback.findOne({ ticketNumber }));
  if (!feedback) notFound();

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-12">
      <Link href="/" className="text-sm font-medium text-gray-900 hover:text-gray-700">
        &larr; Back to home
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-white/70 px-3 py-1 text-sm font-bold tracking-widest text-gray-900">
          {feedback.ticketNumber}
        </span>
        <StatusBadge status={feedback.status} />
        <NatureBadge nature={feedback.nature} />
      </div>

      <h1 className="mt-4 text-2xl font-bold text-gray-900">
        {feedback.schoolOffice || "Feedback"}
      </h1>
      <p className="mt-1 text-xs text-gray-600">
        Submitted on {formatDate(feedback.createdAt)}
        {feedback.fullname ? ` by ${feedback.fullname}` : ""}
      </p>
      {feedback.district && (
        <p className="mt-1 text-xs text-gray-600">District: {feedback.district}</p>
      )}

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="whitespace-pre-wrap text-gray-700">{feedback.description}</p>
      </div>

      <div className="mt-8 flex items-center gap-4 text-sm text-gray-700">
        <Link href="/track" className="font-medium text-gray-900 hover:text-gray-700">
          Track another ticket
        </Link>
        <span aria-hidden="true">&middot;</span>
        <Link href="/file" className="font-medium text-gray-900 hover:text-gray-700">
          File new feedback
        </Link>
      </div>
    </main>
  );
}
