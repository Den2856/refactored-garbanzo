// server/src/middleware/authMiddleware.ts
import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user"; // default export

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email: string; role: "user" | "admin" };
    }
  }
}

const COOKIE_NAME = process.env.COOKIE_NAME || "access_token";
const JWT_SECRET = process.env.JWT_SECRET || "change_me";

function extractToken(req: any): string | null {
  const h: string | undefined = req.headers?.authorization;
  if (h && h.startsWith("Bearer ")) return h.slice(7);
  const c = req.cookies?.[COOKIE_NAME];
  return c ?? null;
}

export const requireAuth: RequestHandler = async (req, res, next) => {
  const token = extractToken(req);
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id?: string };
    if (!payload.id) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }

    const user = await User.findById(payload.id).lean<{ _id: any; email?: string; role?: string }>();
    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    req.user = { id: String(user._id), email: user.email ?? "", role: user.role === "admin" ? "admin" : "user" };
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const optionalAuth: RequestHandler = async (req, _res, next) => {
  const token = extractToken(req);
  if (!token) {
    next();
    return;
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id?: string };
    if (payload.id) {
      const u = await User.findById(payload.id).lean<{ _id: any; email?: string; role?: string }>();
      if (u) req.user = { id: String(u._id), email: u.email ?? "", role: u.role === "admin" ? "admin" : "user" };
    }
  } catch {}
  next();
};

export const requireAdmin: RequestHandler = (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  if (req.user.role !== "admin") {
    res.status(403).json({ message: "Forbidden" });
    return;
  }
  next();
};
