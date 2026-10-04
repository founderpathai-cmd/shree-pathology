import mongoose from "mongoose";

export interface IBooking extends mongoose.Document {
  userId?: any;
  testId?: any;
  labId?: any;
  testName?: string;
  labName?: string;
  patientName: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  phone: string;
  email?: string;
  address: string;
  landmark?: string;
  city?: string;
  pincode?: string;
  collectionType?: "home" | "lab";
  date: string;
  timeSlot: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  amount: number;
  paymentStatus: "Pending" | "Paid" | "Failed";
  paymentId?: string;
  reportUrl?: string;
  bookingFor?: string;
  notes?: string;
  fastingConfirmed?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.Mixed, 
    ref: "User", 
    default: "guest"
  },
  testId: { 
    type: mongoose.Schema.Types.Mixed, 
    ref: "Test" 
  },
  labId: { 
    type: mongoose.Schema.Types.Mixed, 
    ref: "Lab" 
  },
  testName: { type: String },
  labName: { type: String },
  patientName: { type: String, required: true, trim: true },
  age: { type: Number, required: true, min: 0 },
  gender: { 
    type: String, 
    enum: ["Male", "Female", "Other"], 
    required: true 
  },
  phone: { type: String, required: true, trim: true },
  email: { type: String, trim: true },
  address: { type: String, required: true, trim: true },
  landmark: { type: String, trim: true },
  city: { type: String, trim: true, default: "Pune" },
  pincode: { type: String, trim: true },
  collectionType: { type: String, enum: ["home", "lab"], default: "home" },
  date: { type: String, required: true },
  timeSlot: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["Pending", "Confirmed", "Completed", "Cancelled"], 
    default: "Confirmed",
    index: true 
  },
  amount: { type: Number, required: true, min: 0 },
  paymentStatus: { 
    type: String, 
    enum: ["Pending", "Paid", "Failed"], 
    default: "Pending",
    index: true 
  },
  paymentId: { type: String },
  reportUrl: { type: String },
  bookingFor: { type: String, default: "Myself" },
  notes: { type: String },
  fastingConfirmed: { type: Boolean, default: false }
}, { timestamps: true });

// Compound index for user history lookup
bookingSchema.index({ userId: 1, createdAt: -1 });

export const Booking = mongoose.models.Booking || mongoose.model<IBooking>("Booking", bookingSchema);
