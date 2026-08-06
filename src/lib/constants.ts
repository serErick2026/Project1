export const CATEGORIES = ["feature", "bug", "general"] as const;
export type FeedbackCategory = (typeof CATEGORIES)[number];

export const STATUSES = ["open", "planned", "in-progress", "done"] as const;
export type FeedbackStatus = (typeof STATUSES)[number];
