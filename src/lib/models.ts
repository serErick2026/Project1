import mongoose, { Schema, models } from "mongoose";
import {
  CATEGORIES,
  STATUSES,
  type FeedbackCategory,
  type FeedbackStatus,
} from "@/lib/constants";

export { CATEGORIES, STATUSES, type FeedbackCategory, type FeedbackStatus };

export interface IFeedback {
  _id: mongoose.Types.ObjectId;
  ticketNumber: string;
  title: string;
  description: string;
  category: FeedbackCategory;
  status: FeedbackStatus;
  createdAt: Date;
  updatedAt: Date;
}

const feedbackSchema = new Schema<IFeedback>(
  {
    ticketNumber: { type: String, required: true, unique: true, index: true, uppercase: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    category: {
      type: String,
      enum: CATEGORIES,
      default: "general",
    },
    status: {
      type: String,
      enum: STATUSES,
      default: "open",
    },
  },
  { timestamps: true, autoIndex: false }
);

feedbackSchema.index({ createdAt: -1 });

export const Feedback =
  models.Feedback ?? mongoose.model<IFeedback>("Feedback", feedbackSchema);
