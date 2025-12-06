import DoctorProfile from "../models/DoctorProfile.js";
import AvailabilitySlot from "../models/AvailabilitySlot.js";
import User from "../models/User.js";

// LIST DOCTORS
export const listDoctors = async (req, res) => {
  try {
    const { specialization, q, page = 1, limit = 20 } = req.query;

    const filter = { active: true };

    // Handle specialization filter
    if (specialization) {
      filter.specialization = specialization;
    }

    let doctors;
    let total;

    // If there's a search query, we need to search in the User collection
    if (q) {
      // Find users whose names match the query
      const matchingUsers = await User.find({
        name: { $regex: q, $options: "i" }, // Case-insensitive search
      }).select("_id");

      const userIds = matchingUsers.map((user) => user._id);

      // Find doctors whose user is in the matching users
      filter.user = { $in: userIds };

      doctors = await DoctorProfile.find(filter)
        .skip((page - 1) * Number(limit))
        .limit(Number(limit))
        .populate("user", "name email");

      total = await DoctorProfile.countDocuments(filter);
    } else {
      // No search query, just filter by specialization and active status
      doctors = await DoctorProfile.find(filter)
        .skip((page - 1) * Number(limit))
        .limit(Number(limit))
        .populate("user", "name email");

      total = await DoctorProfile.countDocuments(filter);
    }

    res.json({
      success: true,
      data: doctors,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
      },
    });
  } catch (err) {
    console.error("listDoctors Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//  GET DOCTOR
export const getDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await DoctorProfile.findById(id).populate(
      "user",
      "name email"
    );

    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    res.json({ success: true, data: doctor });
  } catch (err) {
    console.error("getDoctor Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//  CREATE DOCTOR
export const createDoctor = async (req, res) => {
  try {
    const { img, userId, specialization, fees, experience, bio } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const doctor = await DoctorProfile.create({
      img,
      user: userId,
      specialization,
      fees,
      experience,
      bio,
    });

    user.role = "doctor";
    await user.save();

    res.status(201).json({ success: true, data: doctor });
  } catch (err) {
    console.error("createDoctor Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//  UPDATE DOCTOR
export const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await DoctorProfile.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updated) return res.status(404).json({ message: "Doctor not found" });

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error("updateDoctor Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//  DELETE DOCTOR
export const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await DoctorProfile.findByIdAndDelete(id);

    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    res.json({ success: true, message: "Doctor deleted" });
  } catch (err) {
    console.error("deleteDoctor Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//  SET AVAILABILITY
export const setAvailability = async (req, res) => {
  try {
    const { id } = req.params; // doctor profile id
    const { slots } = req.body;

    if (!Array.isArray(slots))
      return res.status(400).json({ message: "Slots must be an array" });

    const formatted = slots.map((slot) => ({
      doctor: id,
      start: slot.start,
      end: slot.end,
      recurring: slot.recurring || null,
    }));

    const created = await AvailabilitySlot.insertMany(formatted);

    res.status(201).json({ success: true, data: created });
  } catch (err) {
    console.error("setAvailability Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
