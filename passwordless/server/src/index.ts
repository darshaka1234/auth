import dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import User from "./models/User";
import { connectDB } from "./config/database";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Generate magic link token
const generateToken = (email: string): string => {
  return jwt.sign({ email }, process.env.JWT_SECRET!, {
    expiresIn: "15m",
  });
};

// Send magic link
app.post("/api/auth/magic-link", async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;

    // Create or update user
    const user = await User.findOneAndUpdate(
      { email },
      { email, name },
      { upsert: true, new: true }
    );

    const token = generateToken(email);
    const magicLink = `${process.env.CLIENT_URL}/verify?token=${token}`;

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Magic Link",
      html: `Click <a href="${magicLink}">here</a> to log in. This link will expire in 15 minutes.`,
    });

    res.json({ message: "Magic link sent successfully" });
  } catch (error) {
    console.error("Error sending magic link:", error);
    res.status(500).json({ error: "Failed to send magic link" });
  }
});

// Verify magic link
app.post("/api/auth/verify", async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      email: string;
    };

    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate session token
    const sessionToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    res.json({ token: sessionToken, user });
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
