import { Router } from "express";
import auth from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.js";

import {
  createReview,
  listForDoctor,
} from "../controllers/review.controller.js";
import { createReviewSchema } from "../validators/review.validation.js";

const router = Router();

router.get("/:doctorId", listForDoctor);

router.post("/", auth, validate(createReviewSchema), createReview);

export default router;
