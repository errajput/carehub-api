import { Router } from "express";
import auth from "../middlewares/auth.middleware.js";
import role from "../middlewares/role.middleware.js";
import {
  bookAppointment,
  listByDoctor,
  listByPatient,
  cancelAppointment,
  requestReschedule,
  setStatus,
} from "../controllers/appointment.controller.js";

const router = Router();

router.post("/book", auth, role("patient"), bookAppointment);

router.get("/doctor/:doctorId", auth, role(["admin", "doctor"]), listByDoctor);

router.get(
  "/patient/:patientId",
  auth,
  role(["admin", "patient"]),
  listByPatient
);

router.put("/:id/cancel", auth, cancelAppointment);

router.put("/:id/reschedule", auth, requestReschedule);

router.put("/:id/status", auth, role(["admin", "doctor"]), setStatus);

export default router;
