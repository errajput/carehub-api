import Review from "../models/Review.js";

export const createReview = async (req, res) => {
  const { doctorId, rating, comment } = req.body;
  const patientId = req.user.id;

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
};

export const listForDoctor = async (req, res) => {
  const { doctorId } = req.params;

  const reviews = await Review.find({ doctor: doctorId }).populate(
    "patient",
    "name"
  );

  res.json(reviews);
};
