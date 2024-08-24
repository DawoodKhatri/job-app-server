import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import jobRoutes from "./routes/job.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

export default app;
