import { Router } from "express";
import { validate } from "../middlewares/validate.js";

import {
  register,
  login,
  refresh,
  logout,
} from "../controllers/auth.controller.js";

import {
  registerSchema,
  loginSchema,
  refreshSchema,
  logoutSchema,
} from "../validators/user.schema.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", validate(refreshSchema), refresh);
router.post("/logout", validate(logoutSchema), logout);

export default router;
