import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DoctorProfile",
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    reason: { type: String },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Helpful index to speed up overlap queries
AppointmentSchema.index({ doctor: 1, start: 1, end: 1 });

export default mongoose.model("Appointment", AppointmentSchema);
