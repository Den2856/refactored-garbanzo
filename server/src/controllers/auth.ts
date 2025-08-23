import { type RequestHandler } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user";

const JWT_SECRET = (process.env.JWT_SECRET ?? "change_me") as string;
const JWT_EXPIRES_SECONDS = 7 * 24 * 3600;

function signToken(payload: { id: string; }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_SECONDS });
}

export const register: RequestHandler = async (req, res) => {
  const email = String(req.body.email || "").toLowerCase();
  const name = String(req.body.name || "");
  const password = String(req.body.password || "");
  if (!email || !password) {
    res.status(400).json({ message: "Email and password required" });
    return;
  }

  const exists = await User.findOne({ email }).lean();
  if (exists) {
    res.status(409).json({ message: "Email already in use" });
    return;
  }

  const user = await User.create({ email, name, password });
  const token = signToken({ id: user.id });
  res.status(201).json({ token });
};

export const login: RequestHandler = async (req, res) => {
  const email = String(req.body.email || "").toLowerCase();
  const password = String(req.body.password || "");
  if (!email || !password) {
    res.status(400).json({ message: "Email and password required" });
    return;
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const ok = await bcrypt.compare(password, (user as any).password);
  if (!ok) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const token = signToken({ id: user.id });
  res.json({ token });
};

export const me: RequestHandler = async (req, res) => {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : "";
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

    const u = await User.findById(payload.id).lean<{ _id: any; email: string; name?: string; createdAt?: Date }>();
    if (!u) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({ _id: String(u._id), email: u.email, name: u.name, createdAt: u.createdAt });
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};
