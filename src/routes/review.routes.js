import express from "express";
const router = express.Router();

import auth from "../middlewares/auth.middleware.js";
import {
  createReview,
  listForDoctor,
} from "../controllers/review.controller.js";

router.post("/", auth, createReview);
router.get("/doctor/:doctorId", listForDoctor);

export default router;
