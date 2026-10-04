import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password?: string;
  role: "user" | "admin" | "lab_admin";
  phone?: string;
  address?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  password: { type: String, required: true, select: false },
  role: { 
    type: String, 
    enum: ["user", "admin", "lab_admin"], 
    default: "user",
    index: true 
  },
  phone: { type: String, trim: true },
  address: { type: String, trim: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Add index for searching users by name or email
userSchema.index({ name: 'text', email: 'text' });

export const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
