import mongoose from "mongoose";

export interface ILab extends mongoose.Document {
  name: string;
  address: string;
  city: string;
  phone: string;
  rating: number;
  reviewsCount: number;
  partnerStatus: "pending" | "active" | "inactive";
  about?: string;
  timings?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const labSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  address: { type: String, required: true },
  city: { type: String, required: true, index: true },
  phone: { type: String, required: true },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewsCount: { type: Number, default: 0 },
  partnerStatus: { 
    type: String, 
    enum: ["pending", "active", "inactive"], 
    default: "pending",
    index: true 
  },
  about: { type: String },
  timings: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Add text search capabilities for name and city
labSchema.index({ name: 'text', city: 'text' });

export const Lab = mongoose.models.Lab || mongoose.model<ILab>("Lab", labSchema);
