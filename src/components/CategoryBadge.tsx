import type { FeedbackCategory } from "@/lib/constants";

const styles: Record<FeedbackCategory, string> = {
  feature: "bg-indigo-100 text-indigo-800",
  bug: "bg-red-100 text-red-800",
  general: "bg-gray-100 text-gray-800",
};

const labels: Record<FeedbackCategory, string> = {
  feature: "Feature",
  bug: "Bug",
  general: "General",
};

export function CategoryBadge({ category }: { category: FeedbackCategory }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${styles[category]}`}
    >
      {labels[category]}
    </span>
  );
}
