import DoctorProfile from "../models/DoctorProfile.js";
import AvailabilitySlot from "../models/AvailabilitySlot.js";
import User from "../models/User.js";

// ========================== LIST DOCTORS ==========================
export const listDoctors = async (req, res) => {
  try {
    const { specialization, q, page = 1, limit = 20 } = req.query;

    const filter = { active: true };

    if (specialization) filter.specialization = specialization;
    if (q) filter.$text = { $search: q };

    const doctors = await DoctorProfile.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("user", "name");

    res.json(doctors);
  } catch (err) {
    console.error("listDoctors Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================== GET DOCTOR ==========================
export const getDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await DoctorProfile.findById(id).populate(
      "user",
      "name email"
    );

    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // TODO: Add avg rating & next slots (optional)
    res.json(doctor);
  } catch (err) {
    console.error("getDoctor Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================== CREATE DOCTOR ==========================
export const createDoctor = async (req, res) => {
  try {
    const { userId, specialization, fees, experience, bio } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const doctor = await DoctorProfile.create({
      user: userId,
      specialization,
      fees,
      experience,
      bio,
    });

    user.role = "doctor";
    await user.save();

    res.status(201).json(doctor);
  } catch (err) {
    console.error("createDoctor Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================== UPDATE DOCTOR ==========================
export const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await DoctorProfile.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.json(updated);
  } catch (err) {
    console.error("updateDoctor Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================== DELETE DOCTOR ==========================
export const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    await DoctorProfile.findByIdAndDelete(id);

    res.json({ ok: true });
  } catch (err) {
    console.error("deleteDoctor Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================== SET AVAILABILITY ==========================
export const setAvailability = async (req, res) => {
  try {
    const { id } = req.params; // doctor profile id
    const { slots } = req.body;

    if (!Array.isArray(slots))
      return res.status(400).json({ message: "Slots must be an array" });

    const created = await AvailabilitySlot.insertMany(
      slots.map((slot) => ({
        doctor: id,
        ...slot,
      }))
    );

    res.status(201).json(created);
  } catch (err) {
    console.error("setAvailability Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
