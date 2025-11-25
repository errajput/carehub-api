import mongoose from "mongoose";
import Appointment from "../models/Appointment.js";
import DoctorProfile from "../models/DoctorProfile.js";

// ========================== Helper: Check Overlap ==========================
async function hasOverlap(doctorId, start, end) {
  return await Appointment.exists({
    doctor: doctorId,
    status: { $ne: "cancelled" },
    start: { $lt: new Date(end) },
    end: { $gt: new Date(start) },
  });
}

// ========================== BOOK APPOINTMENT ==========================
export const bookAppointment = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { doctorId, start, end, reason } = req.body;
    const patientId = req.user.id;

    const doctor = await DoctorProfile.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    await session.withTransaction(async () => {
      const overlap = await Appointment.findOne({
        doctor: doctorId,
        status: { $ne: "cancelled" },
        start: { $lt: new Date(end) },
        end: { $gt: new Date(start) },
      }).session(session);

      if (overlap) {
        throw { status: 409, message: "Slot already booked" };
      }

      const appointment = await Appointment.create(
        [
          {
            doctor: doctorId,
            patient: patientId,
            start,
            end,
            reason,
          },
        ],
        { session }
      );

      res.status(201).json(appointment[0]);
    });
  } catch (err) {
    if (err?.status === 409)
      return res.status(409).json({ message: err.message });

    console.error("bookAppointment Error:", err);
    res.status(500).json({ message: "Server error" });
  } finally {
    session.endSession();
  }
};

// ========================== LIST BY DOCTOR ==========================
export const listByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { from, to } = req.query;

    const query = { doctor: doctorId };

    if (from || to) query.start = {};
    if (from) query.start.$gte = new Date(from);
    if (to) query.start.$lte = new Date(to);

    const appointments = await Appointment.find(query).populate(
      "patient",
      "name email"
    );

    res.json(appointments);
  } catch (err) {
    console.error("listByDoctor Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================== LIST BY PATIENT ==========================
export const listByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    const appointments = await Appointment.find({
      patient: patientId,
    }).populate("doctor");

    res.json(appointments);
  } catch (err) {
    console.error("listByPatient Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================== CANCEL APPOINTMENT ==========================
export const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);
    if (!appointment) return res.status(404).json({ message: "Not found" });

    if (
      String(appointment.patient) !== req.user.id &&
      req.user.role !== "admin" &&
      req.user.role !== "doctor"
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    appointment.status = "cancelled";
    await appointment.save();

    res.json({ ok: true });
  } catch (err) {
    console.error("cancelAppointment Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================== REQUEST RESCHEDULE ==========================
export const requestReschedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { newStart, newEnd } = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) return res.status(404).json({ message: "Not found" });

    if (String(appointment.patient) !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    appointment.start = newStart;
    appointment.end = newEnd;
    appointment.status = "pending";

    await appointment.save();

    res.json(appointment);
  } catch (err) {
    console.error("requestReschedule Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================== SET STATUS (admin/doctor) ==========================
export const setStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) return res.status(404).json({ message: "Not found" });

    appointment.status = status;
    await appointment.save();

    res.json(appointment);
  } catch (err) {
    console.error("setStatus Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
