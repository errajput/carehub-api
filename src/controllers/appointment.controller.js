import mongoose from "mongoose";

import DoctorProfile from "../models/DoctorProfile.js";

import {
  bookAppointmentSchema,
  listByDoctorParams,
  listByDoctorQuery,
  listByPatientParams,
  cancelAppointmentParams,
  requestRescheduleParams,
  requestRescheduleBody,
  setStatusParams,
  setStatusBody,
} from "../validators/appointment.validator.js";

import { z } from "zod";
import Appointment from "../models/Appointment.js";

// ========================== BOOK APPOINTMENT ==========================
export const bookAppointment = async (req, res) => {
  try {
    // ---- Zod validation ----
    bookAppointmentSchema.parse(req.body);

    const { doctorId, start, end, reason } = req.body;
    const patientId = req.user.id;

    const session = await mongoose.startSession();
    const doctor = await DoctorProfile.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    await session.withTransaction(async () => {
      const overlap = await AppointmentSchema.findOne({
        doctor: doctorId,
        status: { $ne: "cancelled" },
        start: { $lt: new Date(end) },
        end: { $gt: new Date(start) },
      }).session(session);

      if (overlap) {
        throw { status: 409, message: "Slot already booked" };
      }

      const appointment = await AppointmentSchema.create(
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

    session.endSession();
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Validation error", errors: err.errors });
    }

    if (err?.status === 409)
      return res.status(409).json({ message: err.message });

    console.error("bookAppointment Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================== LIST BY DOCTOR ==========================
export const listByDoctor = async (req, res) => {
  try {
    listByDoctorParams.parse(req.params);
    listByDoctorQuery.parse(req.query);

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
    if (err instanceof z.ZodError)
      return res.status(400).json({ errors: err.errors });

    console.error("listByDoctor Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================== LIST BY PATIENT ==========================
export const listByPatient = async (req, res) => {
  try {
    listByPatientParams.parse(req.params);

    const { patientId } = req.params;

    const appointments = await Appointment.find({
      patient: patientId,
    }).populate("doctor");

    res.json(appointments);
  } catch (err) {
    if (err instanceof z.ZodError)
      return res.status(400).json({ errors: err.errors });

    console.error("listByPatient Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================== CANCEL APPOINTMENT ==========================
export const cancelAppointment = async (req, res) => {
  try {
    cancelAppointmentParams.parse(req.params);

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
    if (err instanceof z.ZodError)
      return res.status(400).json({ errors: err.errors });

    console.error("cancelAppointment Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================== REQUEST RESCHEDULE ==========================
export const requestReschedule = async (req, res) => {
  try {
    requestRescheduleParams.parse(req.params);
    requestRescheduleBody.parse(req.body);

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
    if (err instanceof z.ZodError)
      return res.status(400).json({ errors: err.errors });

    console.error("requestReschedule Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================== SET STATUS ==========================
export const setStatus = async (req, res) => {
  try {
    setStatusParams.parse(req.params);
    setStatusBody.parse(req.body);

    const { id } = req.params;
    const { status } = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) return res.status(404).json({ message: "Not found" });

    appointment.status = status;
    await appointment.save();

    res.json(appointment);
  } catch (err) {
    if (err instanceof z.ZodError)
      return res.status(400).json({ errors: err.errors });

    console.error("setStatus Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
