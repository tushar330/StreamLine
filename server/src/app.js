import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";
import healthRoutes from "./routes/health.routes.js";

dotenv.config();
const app = express();

// middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

// routes
app.use("/health", healthRoutes);

// boot
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

async function start() {
  try {
    if (MONGO_URI) {
      await mongoose.connect(MONGO_URI);
      console.log("Mongo connected");
    } else {
      console.warn("MONGO_URI missing—continuing without DB");
    }
    app.listen(PORT, () => console.log(`API listening on :${PORT}`));
  } catch (err) {
    console.error("Boot error:", err);
    process.exit(1);
  }
}
start();
