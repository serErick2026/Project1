"use server";

import { withConnection } from "@/lib/db";
import { Feedback, CATEGORIES, type FeedbackCategory } from "@/lib/models";

export type ActionResult =
  | { success: true; ticketNumber: string }
  | { success: false; error: string };

const TICKET_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generateTicketNumber(): string {
  const buffer = crypto.getRandomValues(new Uint32Array(6));
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += TICKET_CHARS[buffer[i] % TICKET_CHARS.length];
  }
  return `FB-${code}`;
}

export async function createFeedback(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const rawCategory = String(formData.get("category") ?? "general");
  const category: FeedbackCategory = CATEGORIES.includes(rawCategory as FeedbackCategory)
    ? (rawCategory as FeedbackCategory)
    : "general";

  if (!title) return { success: false, error: "Title is required." };
  if (title.length > 120) return { success: false, error: "Title must be 120 characters or fewer." };
  if (!description) return { success: false, error: "Description is required." };
  if (description.length > 2000)
    return { success: false, error: "Description must be 2000 characters or fewer." };

  return withConnection(async () => {
    for (let attempt = 0; attempt < 5; attempt++) {
      const ticketNumber = generateTicketNumber();
      try {
        await Feedback.create({ title, description, category, ticketNumber });
        return { success: true, ticketNumber };
      } catch (err) {
        if (err && typeof err === "object" && "code" in err && (err as { code?: number }).code === 11000) {
          continue;
        }
        throw err;
      }
    }

    return { success: false, error: "Could not save feedback. Please try again." };
  });
}
