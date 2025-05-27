import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User } from "../models/User";
import RefreshToken from "../models/RefreshToken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = "your_super_secret_jwt_key_2024";
const ACCESS_TOKEN_EXPIRY = "1m";

// Generate tokens
const generateTokens = async (userId: string) => {
  const accessToken = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });

  const refreshToken = crypto.randomBytes(40).toString("hex");
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

  // Save refresh token to database
  await RefreshToken.create({
    token: refreshToken,
    user: userId,
    expiresAt,
  });

  return { accessToken, refreshToken };
};

// Register user
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate tokens
    const { accessToken, refreshToken } = await generateTokens(
      user._id.toString()
    );

    res.status(201).json({
      message: "User registered successfully",
      token: accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Error registering user" });
  }
};

// Login user
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate tokens
    const { accessToken, refreshToken } = await generateTokens(
      user._id.toString()
    );

    res.json({
      message: "Login successful",
      token: accessToken,
      refreshToken,
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
};

// Refresh token
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    // Find refresh token in database
    const tokenDoc = await RefreshToken.findOne({ token: refreshToken });
    if (!tokenDoc) {
      return res.status(400).json({ message: "Invalid refresh token" });
    }

    // Check if token is expired
    if (tokenDoc.expiresAt < new Date()) {
      await RefreshToken.deleteOne({ token: refreshToken });
      return res.status(400).json({ message: "Refresh token has expired" });
    }

    // Generate new tokens
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await generateTokens(tokenDoc.user.toString());

    // Delete old refresh token
    await RefreshToken.deleteOne({ token: refreshToken });

    res.json({
      message: "Token refreshed successfully",
      token: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    res.status(500).json({ message: "Error refreshing token" });
  }
};

// Get current user
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ message: "Error getting current user" });
  }
};

// Logout
export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      // Delete refresh token from database
      await RefreshToken.deleteOne({ token: refreshToken });
    }

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Error logging out" });
  }
};
