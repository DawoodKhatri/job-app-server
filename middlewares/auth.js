import { ROLES } from "../constants/roles.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied",
    });
  }

  try {
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    req.user = await User.findById(decoded._id);
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Access denied",
    });
  }
};

export const isAdmin = async (req, res, next) => {
  if (req.user.role !== ROLES.ADMIN) {
    return res.status(403).json({
      success: false,
      message: "Access denied",
    });
  }
  next();
};

export const isUser = async (req, res, next) => {
  if (req.user.role !== ROLES.USER) {
    return res.status(403).json({
      success: false,
      message: "Access denied",
    });
  }
  next();
};
