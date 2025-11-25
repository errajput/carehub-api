import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || "CareHub-API";
const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(MONGODB_URI, { dbName: DB_NAME });
mongoose.connection.on("connected", () => console.log("MongoDB Connected"));

app.get("/", (req, res) => res.send("Ok"));

// Not Found -- Wild Card Routes
app.use((req, res) => {
  console.log("Not Found", req.path, req.method);
  // throw Error("My Error");
  res.status(404).send({ message: "Page Not Found" });
});

// Express Error Handling
app.use((err, req, res, next) => {
  res.status(500).send({ message: "My Error" });
});

app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));
