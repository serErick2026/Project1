import mongoose, { Schema, models } from "mongoose";
import {
  NATURES,
  STATUSES,
  type FeedbackNature,
  type FeedbackStatus,
} from "@/lib/constants";

export {
  NATURES,
  STATUSES,
  type FeedbackNature,
  type FeedbackStatus,
};

export interface IFeedback {
  _id: mongoose.Types.ObjectId;
  ticketNumber: string;
  fullname?: string;
  cellphone?: string;
  email: string;
  emailVerified: boolean;
  district?: string;
  schoolOffice: string;
  nature: FeedbackNature;
  description: string;
  status: FeedbackStatus;
  createdAt: Date;
  updatedAt: Date;
}

const feedbackSchema = new Schema<IFeedback>(
  {
    ticketNumber: { type: String, required: true, unique: true, index: true, uppercase: true },
    fullname: { type: String, trim: true, maxlength: 100 },
    cellphone: { type: String, trim: true, maxlength: 20 },
    email: { type: String, required: true, trim: true, lowercase: true },
    emailVerified: { type: Boolean, default: false },
    district: { type: String, trim: true, maxlength: 100 },
    schoolOffice: { type: String, required: true, trim: true, maxlength: 200 },
    nature: {
      type: String,
      enum: NATURES.map((n) => n.value),
      required: true,
    },
    description: { type: String, required: true, trim: true, maxlength: 4000 },
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

export interface IOtp {
  email: string;
  codeHash: string;
  expiresAt: Date;
  verified: boolean;
  createdAt: Date;
}

const otpSchema = new Schema<IOtp>(
  {
    email: { type: String, required: true, trim: true, lowercase: true, index: true },
    codeHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true, autoIndex: false }
);

export const Otp = models.Otp ?? mongoose.model<IOtp>("Otp", otpSchema);
