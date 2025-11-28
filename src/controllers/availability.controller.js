import AvailabilitySlot from "../models/AvailabilitySlot.js";
import DoctorProfile from "../models/DoctorProfile.js";

// CHECK OVERLAP
async function hasOverlap(doctorId, start, end, ignoreId = null) {
  const query = {
    doctor: doctorId,
    start: { $lt: new Date(end) },
    end: { $gt: new Date(start) },
  };

  if (ignoreId) query._id = { $ne: ignoreId };

  return AvailabilitySlot.exists(query);
}

//  CREATE SLOT
export const createAvailability = async (req, res) => {
  try {
    const { doctor, start, end, recurring } = req.body;

    const docExists = await DoctorProfile.findById(doctor);
    if (!docExists)
      return res.status(404).json({ message: "Doctor not found" });

    const overlap = await hasOverlap(doctor, start, end);
    if (overlap)
      return res.status(409).json({ message: "Slot already exists (overlap)" });

    const slot = await AvailabilitySlot.create({
      doctor,
      start,
      end,
      recurring,
    });

    res.status(201).json(slot);
  } catch (err) {
    console.error("createAvailability ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET SLOTS BY DOCTOR
export const getAvailabilityByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { from, to, recurring } = req.query;

    const query = { doctor: doctorId };

    if (recurring) query.recurring = recurring;

    if (from || to) query.start = {};
    if (from) query.start.$gte = new Date(from);
    if (to) query.start.$lte = new Date(to);

    const slots = await AvailabilitySlot.find(query);

    res.json(slots);
  } catch (err) {
    console.error("getAvailabilityByDoctor ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//  UPDATE SLOT
export const updateAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const slot = await AvailabilitySlot.findById(id);
    if (!slot) return res.status(404).json({ message: "Not found" });

    const { doctor, start, end, recurring } = req.body;

    // If updating times → validate overlapping
    if (start || end) {
      const newStart = start || slot.start;
      const newEnd = end || slot.end;

      const overlap = await hasOverlap(slot.doctor, newStart, newEnd, id);
      if (overlap)
        return res
          .status(409)
          .json({ message: "Updated time overlaps existing slot" });
    }

    slot.doctor = doctor ?? slot.doctor;
    slot.start = start ?? slot.start;
    slot.end = end ?? slot.end;
    slot.recurring = recurring ?? slot.recurring;

    await slot.save();

    res.json(slot);
  } catch (err) {
    console.error("updateAvailability ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE SLOT
export const deleteAvailability = async (req, res) => {
  try {
    const { id } = req.params;

    const slot = await AvailabilitySlot.findById(id);
    if (!slot) return res.status(404).json({ message: "Not found" });

    await slot.deleteOne();

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("deleteAvailability ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
