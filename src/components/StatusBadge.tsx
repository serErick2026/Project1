import type { FeedbackStatus } from "@/lib/constants";

const styles: Record<FeedbackStatus, string> = {
  open: "bg-emerald-100 text-emerald-800",
  planned: "bg-blue-100 text-blue-800",
  "in-progress": "bg-amber-100 text-amber-800",
  done: "bg-purple-100 text-purple-800",
};

const labels: Record<FeedbackStatus, string> = {
  open: "Open",
  planned: "Planned",
  "in-progress": "In progress",
  done: "Done",
};

export function StatusBadge({ status }: { status: FeedbackStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
