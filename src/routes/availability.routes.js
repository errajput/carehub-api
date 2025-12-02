import express from "express";
import { validate } from "../middlewares/validate.js";

import {
  createAvailability,
  updateAvailability,
  deleteAvailability,
  getAvailabilityByDoctor,
} from "../controllers/availability.controller.js";

import {
  createSlotSchema,
  updateSlotSchema,
  slotIdParams,
  doctorIdParams,
  slotQuerySchema,
} from "../validators/availabilitySlot.validator.js";

import auth from "../middlewares/auth.middleware.js";
import role from "../middlewares/role.middleware.js";
import z from "zod";

const router = express.Router();

// Doctor creates slot
router.post(
  "/",
  auth,
  role("doctor"),
  validate(createSlotSchema),
  createAvailability
);

// Doctor updates slot
router.patch(
  "/:id",
  auth,
  role("doctor"),
  validate({
    body: updateSlotSchema,
    params: slotIdParams,
  }),
  updateAvailability
);

// Doctor deletes slot
router.delete(
  "/:id",
  auth,
  role("doctor"),
  validate(slotIdParams),
  deleteAvailability
);

// Everyone can see doctor's available slots
router.get(
  "/doctor/:doctorId",
  validate(
    z.object({
      params: doctorIdParams,
      query: slotQuerySchema,
    })
  ),
  getAvailabilityByDoctor
);

export default router;
