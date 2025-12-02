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
import DoctorProfile from "../models/DoctorProfile.js";

const router = Router();

// PUBLIC ROUTES
router.get("/", listDoctors);
router.get("/:id", getDoctor);

//  ADMIN / DOCTOR ROUTES
// Create a new doctor (only admin)
router.post("/", auth, role("admin"), createDoctor);

// Update doctor profile (admin or doctor)
router.patch("/:id", auth, role(["admin", "doctor"]), updateDoctor);

// Delete doctor (admin only)
router.delete("/:id", auth, role(["admin", "doctor"]), deleteDoctor);

// Doctor sets availability (only doctor)
router.post("/:id/availability", auth, role("doctor"), setAvailability);

// Doctor profile
router.get("/:id", async (req, res) => {
  try {
    const doctor = await DoctorProfile.findById(req.params.id).populate(
      "user",
      "_id name email"
    );

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    return res.json({ success: true, data: doctor });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
