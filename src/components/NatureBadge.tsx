import { NATURE_LABELS, type FeedbackNature } from "@/lib/constants";

const styles: Record<FeedbackNature, string> = {
  complaint: "bg-red-100 text-red-800",
  suggestion: "bg-indigo-100 text-indigo-800",
  praise: "bg-emerald-100 text-emerald-800",
};

export function NatureBadge({ nature }: { nature: FeedbackNature }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${styles[nature]}`}
    >
      {NATURE_LABELS[nature]}
    </span>
  );
}
