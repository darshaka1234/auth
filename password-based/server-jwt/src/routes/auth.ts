import express from "express";
import {
  register,
  login,
  getCurrentUser,
  refreshToken,
  logout,
} from "../controllers/auth";
import { auth } from "../middleware/auth";

const router = express.Router();

// Public routes
router.post("/register", register as express.RequestHandler);
router.post("/login", login as express.RequestHandler);
router.post("/refresh-token", refreshToken as express.RequestHandler);
router.post("/logout", logout as express.RequestHandler);

// Protected routes
router.get("/me", auth, getCurrentUser as express.RequestHandler);

export default router;
