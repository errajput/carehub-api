import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// Import Routes
import authRoutes from "./routes/auth.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import availabilityRoutes from "./routes/availability.routes.js";

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || "CareHub-API";
const PORT = process.env.PORT || 5000;

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(MONGODB_URI, { dbName: DB_NAME })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Failed:", err));

// Default Route
app.get("/", (req, res) => res.send("Ok"));

// APIs
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/availability", availabilityRoutes);

// 404 Route
app.use((req, res) => {
  console.log("Not Found", req.path, req.method);
  res.status(404).send({ message: "Page Not Found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).send({ message: "Internal Server Error" });
});

// Start Server
app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));
