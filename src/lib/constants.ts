export const NATURES = [
  { value: "complaint", label: "Complaint" },
  { value: "suggestion", label: "Suggestion" },
  { value: "praise", label: "Praise" },
] as const;

export type FeedbackNature = (typeof NATURES)[number]["value"];

export const NATURE_LABELS: Record<FeedbackNature, string> = {
  complaint: "Complaint",
  suggestion: "Suggestion",
  praise: "Praise",
};

export const STATUSES = ["open", "planned", "in-progress", "done"] as const;
export type FeedbackStatus = (typeof STATUSES)[number];

export const CHALLENGE_QUESTIONS = [
  { question: "What is 3 + 4?", answer: "7" },
  { question: "What is 10 - 3?", answer: "7" },
  { question: "What is 5 x 2?", answer: "10" },
  { question: "What color is grass?", answer: "green" },
  { question: "What color is the sky on a clear day?", answer: "blue" },
  { question: "Which is a day of the week: Monday or January?", answer: "monday" },
  { question: "How many days are there in a week?", answer: "7" },
  { question: "What animal says meow?", answer: "cat" },
] as const;
