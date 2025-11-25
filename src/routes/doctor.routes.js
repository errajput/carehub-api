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

router.get("/", listDoctors);
router.get("/:id", getDoctor);
router.post("/", auth, role("admin"), createDoctor);
router.put("/:id", auth, role(["admin", "doctor"]), updateDoctor);
router.delete("/:id", auth, role("admin"), deleteDoctor);
router.post("/:id/availability", auth, role("doctor"), setAvailability);

export default router;
