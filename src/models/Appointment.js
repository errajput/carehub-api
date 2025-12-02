import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DoctorProfile",
      required: [true, "Doctor ID is required"],
    },

    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Patient ID is required"],
    },

    start: {
      type: Date,
      required: [true, "Start time is required"],
    },

    end: {
      type: Date,
      required: [true, "End time is required"],
    },

    reason: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", AppointmentSchema);
