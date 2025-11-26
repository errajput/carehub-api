import express from "express";
import {
  bookAppointment,
  listByDoctor,
  listByPatient,
  cancelAppointment,
  requestReschedule,
  setStatus,
} from "../controllers/appointment.controller.js";

import { validate } from "../middlewares/validate.js";
import {
  bookAppointmentSchema,
  cancelAppointmentParams,
  listByDoctorParams,
  listByDoctorQuery,
  requestRescheduleBody,
  setStatusBody,
} from "../validators/appointment.validator.js";

const router = express.Router();

router.post("/", validate(bookAppointmentSchema), bookAppointment);
router.get(
  "/doctor/:doctorId",
  validate({ params: listByDoctorParams, query: listByDoctorQuery }),
  listByDoctor
);
router.get("/patient/:patientId", listByPatient);
router.patch(
  "/:id/cancel",
  validate(cancelAppointmentParams),
  cancelAppointment
);
router.patch(
  "/:id/reschedule",
  validate(requestRescheduleBody),
  requestReschedule
);
router.patch("/:id/status", validate(setStatusBody), setStatus);

export default router;
