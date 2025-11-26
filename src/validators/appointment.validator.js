import { z } from "zod";

// ===================== COMMON =====================
export const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

// ===================== BOOK APPOINTMENT =====================
export const bookAppointmentSchema = z.object({
  doctorId: objectId,
  start: z.string().datetime(),
  end: z.string().datetime(),
  reason: z.string().min(3, "Reason must be at least 3 chars"),
});

// ===================== LIST BY DOCTOR =====================
export const listByDoctorParams = z.object({
  doctorId: objectId,
});

export const listByDoctorQuery = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});

// ===================== LIST BY PATIENT =====================
export const listByPatientParams = z.object({
  patientId: objectId,
});

// ===================== CANCEL APPOINTMENT =====================
export const cancelAppointmentParams = z.object({
  id: objectId,
});

// ===================== REQUEST RESCHEDULE =====================
export const requestRescheduleParams = z.object({
  id: objectId,
});

export const requestRescheduleBody = z.object({
  newStart: z.string().datetime(),
  newEnd: z.string().datetime(),
});

// ===================== SET STATUS =====================
export const setStatusParams = z.object({
  id: objectId,
});

export const setStatusBody = z.object({
  status: z.enum(["pending", "confirmed", "completed", "cancelled"]),
});
