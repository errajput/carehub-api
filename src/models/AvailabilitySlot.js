import mongoose from "mongoose";

const AvailabilitySlotSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DoctorProfile",
      required: true,
    },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    recurring: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("AvailabilitySlot", AvailabilitySlotSchema);
