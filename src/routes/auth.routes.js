import { Router } from "express";
import { validate } from "../middlewares/validate.js";

import {
  register,
  login,
  refresh,
  logout,
  changePassword,
  updateUser,
  getAllUsers,
  deleteAccount,
} from "../controllers/auth.controller.js";

import {
  registerSchema,
  loginSchema,
  refreshSchema,
  logoutSchema,
  changePasswordSchema,
  updateUserSchema,
} from "../validators/user.schema.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";

const router = Router();

router.get("/", authMiddleware, roleMiddleware(["admin"]), getAllUsers);
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", validate(refreshSchema), refresh);
router.post("/logout", validate(logoutSchema), logout);
router.patch("/update", authMiddleware, validate(updateUserSchema), updateUser);

router.patch(
  "/change-password",
  authMiddleware,
  validate(changePasswordSchema),
  changePassword
);

router.delete("/delete-account", authMiddleware, deleteAccount);
export default router;
