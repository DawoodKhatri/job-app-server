import { Router } from "express";
import {
  applyJob,
  changeJobStatus,
  createJob,
  getActiveJobs,
  getAllJobs,
  getApplications,
  updateJob,
  userJobs,
} from "../controllers/job.js";
import { isAdmin, isAuthenticated, isUser } from "../middlewares/auth.js";

const jobRoutes = Router();

jobRoutes.get("/", getActiveJobs);
jobRoutes.get("/all", isAuthenticated, isAdmin, getAllJobs);
jobRoutes.get("/applied", isAuthenticated, isUser, userJobs);
jobRoutes.get("/:jobId/applications", isAuthenticated, isAdmin, getApplications);
jobRoutes.post("/", isAuthenticated, isAdmin, createJob);
jobRoutes.put("/:jobId", isAuthenticated, isAdmin, updateJob);
jobRoutes.patch("/:jobId", isAuthenticated, isAdmin, changeJobStatus);
jobRoutes.post("/:jobId/apply", isAuthenticated, isUser, applyJob);

export default jobRoutes;
