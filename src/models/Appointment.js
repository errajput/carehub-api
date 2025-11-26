import { z } from "zod";

export const AppointmentSchema = z.object({
  doctor: z.string().min(1, "Doctor ID is required"),
  patient: z.string().min(1, "Patient ID is required"),
  start: z.coerce.date({
    required_error: "Start time is required",
    invalid_type_error: "Invalid date format for start",
  }),
  end: z.coerce.date({
    required_error: "End time is required",
    invalid_type_error: "Invalid date format for end",
  }),
  reason: z.string().optional(),

  status: z.enum(["pending", "confirmed", "cancelled", "completed"]).optional(),
});
