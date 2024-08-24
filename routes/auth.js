import { Router } from "express";
import { authStatus, loginUser, signupUser } from "../controllers/auth.js";
import { isAuthenticated } from "../middlewares/auth.js";

const authRoutes = Router();

authRoutes.post("/signup", signupUser);
authRoutes.post("/login", loginUser);
authRoutes.get("/status", isAuthenticated, authStatus);

export default authRoutes;
