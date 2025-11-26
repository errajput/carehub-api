import { z } from "zod";

// ========================= CREATE =========================
export const createDoctorSchema = z.object({
  body: z.object({
    user: z.string().min(1, "User ID required"),
    specialization: z.string().min(2).optional(),
    fees: z.number().nonnegative().optional(),
    experience: z.number().min(0).optional(),
    bio: z.string().max(500).optional(),
    active: z.boolean().optional(),
  }),
});

// ========================= UPDATE =========================
export const updateDoctorSchema = z.object({
  body: z.object({
    specialization: z.string().min(2).optional(),
    fees: z.number().nonnegative().optional(),
    experience: z.number().min(0).optional(),
    bio: z.string().max(500).optional(),
    active: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().min(1),
  }),
});

// ========================= PARAMS ONLY =========================
export const doctorIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});
