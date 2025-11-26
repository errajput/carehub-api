import { z } from "zod";

export const createReviewSchema = z.object({
  body: z.object({
    doctorId: z.string().min(1, "Doctor ID is required"),
    rating: z.number().min(1).max(5),
    comment: z.string().optional(),
  }),

  params: z.object({}).optional(), // no params needed

  query: z.object({}).optional(),
});
export const listReviewSchema = z.object({
  params: z.object({
    doctorId: z.string().min(1, "Doctor ID is required"),
  }),
  body: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const updateReviewSchema = z.object({
  body: z.object({
    rating: z.number().min(1).max(5).optional(),
    comment: z.string().optional(),
  }),
  params: z.object({
    id: z.string(),
  }),
  query: z.object({}).optional(),
});
