import { z } from "zod";

// REGISTER
export const registerSchema = {
  body: z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
};

// LOGIN
export const loginSchema = {
  body: z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(1, "Password required"),
  }),
};

// UPDATE PROFILE
export const updateUserSchema = {
  body: z.object({
    name: z.string().min(3).optional(),
    email: z.string().email().optional(),
  }),
};

// CHANGE PASSWORD
export const changePasswordSchema = {
  body: z.object({
    oldPassword: z.string().min(6),
    newPassword: z.string().min(6),
  }),
};
