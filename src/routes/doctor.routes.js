import { Router } from "express";
import auth from "../middlewares/auth.middleware.js";
import role from "../middlewares/role.middleware.js";

import {
  listDoctors,
  getDoctor,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  setAvailability,
} from "../controllers/doctor.controller.js";

const router = Router();

// ========================== PUBLIC ROUTES ==========================
router.get("/", listDoctors);
router.get("/:id", getDoctor);

// ========================== ADMIN / DOCTOR ROUTES ==========================
// Create a new doctor (only admin)
router.post("/", auth, role("admin"), createDoctor);

// Update doctor profile (admin or doctor)
router.put("/:id", auth, role(["admin", "doctor"]), updateDoctor);

// Delete doctor (admin only)
router.delete("/:id", auth, role("admin"), deleteDoctor);

// Doctor sets availability (only doctor)
router.post("/:id/availability", auth, role("doctor"), setAvailability);

export default router;
