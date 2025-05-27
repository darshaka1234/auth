import { Router } from "express";
import { User } from "../models/User";
import { PasswordResetToken } from "../models/PasswordResetToken";
import { AuthRequest, isNotAuthenticated } from "../middleware/auth";
import { sendPasswordResetEmail } from "../services/email";
import crypto from "crypto";

const router = Router();

// Signup route
router.post("/signup", isNotAuthenticated, async (req: AuthRequest, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
    });

    await user.save();

    // Set session
    req.session.userId = user._id.toString();
    req.session.isAuthenticated = true;

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Error creating user" });
  }
});

// Login route
router.post("/login", isNotAuthenticated, async (req: AuthRequest, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Set session
    req.session.userId = user._id.toString();
    req.session.isAuthenticated = true;

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in" });
  }
});

// Logout route
router.post("/logout", (req: AuthRequest, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out successfully" });
  });
});

// Get current user
router.get("/me", (req: AuthRequest, res) => {
  if (!req.session.isAuthenticated || !req.session.userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  res.json({
    userId: req.session.userId,
    isAuthenticated: true,
  });
});

// Forgot password route
router.post(
  "/forgot-password",
  isNotAuthenticated,
  async (req: AuthRequest, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        // Don't reveal that the user doesn't exist
        return res.json({
          message:
            "If your email is registered, you will receive a password reset link",
        });
      }

      // Delete any existing reset tokens for this user
      await PasswordResetToken.deleteMany({ userId: user._id });

      // Generate reset token
      const token = crypto.randomBytes(32).toString("hex");

      // Save token to database
      await PasswordResetToken.create({
        userId: user._id,
        token,
      });

      // Send email
      await sendPasswordResetEmail(email, token);

      res.json({
        message:
          "If your email is registered, you will receive a password reset link",
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ message: "Error processing request" });
    }
  }
);

// Reset password route
router.post(
  "/reset-password",
  isNotAuthenticated,
  async (req: AuthRequest, res) => {
    try {
      const { token, password } = req.body;

      if (!token || !password) {
        return res
          .status(400)
          .json({ message: "Token and password are required" });
      }

      // Find token
      const resetToken = await PasswordResetToken.findOne({ token });
      if (!resetToken) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      // Find user
      const user = await User.findById(resetToken.userId);
      if (!user) {
        await resetToken.deleteOne();
        return res.status(400).json({ message: "User not found" });
      }

      // Update password
      user.password = password;
      await user.save();

      // Delete used token
      await resetToken.deleteOne();

      res.json({ message: "Password has been reset successfully" });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Error resetting password" });
    }
  }
);

export default router;
