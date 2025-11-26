import { z } from "zod";

// ==================== REGISTER ====================
export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["patient", "doctor", "admin"]).optional(), // optional if auto-set
  }),

  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

// ==================== LOGIN ====================
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(1, "Password required"),
  }),

  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

// ==================== REFRESH TOKEN ====================
export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(10, "Refresh token required"),
  }),

  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

// ==================== LOGOUT ====================
export const logoutSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(10, "Refresh token required"),
  }),

  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

// ==================== UPDATE PROFILE ====================
export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(3).optional(),
    email: z.string().email().optional(),
  }),

  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

// ==================== CHANGE PASSWORD ====================
export const changePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(6),
    newPassword: z.string().min(6),
  }),

  params: z.object({}).optional(),
  query: z.object({}).optional(),
});
