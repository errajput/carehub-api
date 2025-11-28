import mongoose from "mongoose";

const DoctorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    specialization: { type: String },
    fees: { type: Number },
    experience: { type: Number },
    bio: { type: String },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("DoctorProfile", DoctorProfileSchema);
