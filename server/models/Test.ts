import mongoose from "mongoose";

export interface ITest extends mongoose.Document {
  name: string;
  description: string;
  type: "test" | "package";
  price: number;
  originalPrice?: number;
  lab: mongoose.Types.ObjectId;
  fastingRequired: boolean;
  reportTime: string;
  parameters: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const testSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  type: { 
    type: String, 
    enum: ["test", "package"], 
    default: "test",
    required: true 
  },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, min: 0 },
  lab: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Lab", 
    required: true,
    index: true 
  },
  fastingRequired: { type: Boolean, default: false },
  reportTime: { type: String, default: "24 Hours" },
  parameters: [{ type: String }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Compound index for finding tests within a specific lab and searching by name
testSchema.index({ lab: 1, name: 1 });
testSchema.index({ name: 'text' });

export const Test = mongoose.models.Test || mongoose.model<ITest>("Test", testSchema);
