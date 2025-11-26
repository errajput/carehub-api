import Review from "../models/Review.js";

// ========================== CREATE REVIEW ==========================
export const createReview = async (req, res) => {
  try {
    const { doctorId, rating, comment } = req.body;
    const patientId = req.user.id;

    // Check duplicate review
    const existing = await Review.findOne({
      doctor: doctorId,
      patient: patientId,
    });

    if (existing) {
      return res.status(400).json({ message: "Already reviewed" });
    }

    const review = await Review.create({
      doctor: doctorId,
      patient: patientId,
      rating,
      comment,
    });

    res.status(201).json(review);
  } catch (err) {
    console.error("createReview Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================== LIST REVIEWS FOR DOCTOR ==========================
export const listForDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const reviews = await Review.find({ doctor: doctorId }).populate(
      "patient",
      "name"
    );

    res.json(reviews);
  } catch (err) {
    console.error("listForDoctor Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
