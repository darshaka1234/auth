import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import { Session, SessionData } from "express-session";

export interface AuthRequest extends Request {
  session: Session &
    Partial<SessionData> & {
      userId?: string;
      isAuthenticated?: boolean;
    };
  user?: any;
}

export const isAuthenticated = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.session.isAuthenticated || !req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await User.findById(req.session.userId);
    if (!user) {
      req.session.destroy(() => {});
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const isNotAuthenticated = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.session.isAuthenticated) {
    return res.status(400).json({ message: "Already authenticated" });
  }
  next();
};
