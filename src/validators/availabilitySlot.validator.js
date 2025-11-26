import { z } from "zod";

// ========================== ObjectId Validator ==========================
export const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

// ========================== Recurring Options ==========================
export const recurringEnum = z
  .enum(["WEEKLY", "DAILY", "MONTHLY"])
  .optional()
  .nullable();

// ========================== Base Slot Schema ==========================
const baseSlotSchema = z
  .object({
    doctor: objectId,
    start: z.string().datetime(),
    end: z.string().datetime(),
    recurring: recurringEnum,
  })
  .refine((data) => new Date(data.start) < new Date(data.end), {
    message: "Start time must be before end time",
    path: ["start"],
  });

// ========================== CREATE SLOT ==========================
export const createSlotSchema = baseSlotSchema;

// ========================== UPDATE SLOT ==========================
export const updateSlotSchema = baseSlotSchema.partial();

// ========================== PARAMS ==========================
export const slotIdParams = z.object({
  id: objectId,
});

export const doctorIdParams = z.object({
  doctorId: objectId,
});

// ========================== QUERY FILTERS ==========================
export const slotQuerySchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  recurring: recurringEnum,
});
