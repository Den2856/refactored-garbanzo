import { Router, type RequestHandler } from "express";
import EV, { IEV } from "../models/ev";
import { Types } from "mongoose";

const router = Router();

// GET /api/evs?brandSlug=...
const listEVs: RequestHandler = async (req, res) => {
  const { brandSlug } = req.query as { brandSlug?: string };
  try {
    const query = brandSlug ? { brandSlug } : {};
    const evs: IEV[] = await EV.find(query).sort({ createdAt: -1 });
    res.status(200).json(evs);
  } catch {
    res.status(500).json({ message: "Failed to fetch EVs" });
  }
};
router.get("/", listEVs);

// GET /api/evs/popular
const popular: RequestHandler = async (_req, res) => {
  try {
    const evs = await EV.find({ isPopular: true }).limit(3);
    res.status(200).json(evs);
  } catch {
    res.status(500).json({ message: "Failed to fetch popular EVs" });
  }
};
router.get("/popular", popular);

// GET /api/evs/compare?ids=<id|slug>,<id|slug>…
const compare: RequestHandler = async (req, res) => {
  try {
    const idsParam = String(req.query.ids || "");
    const tokens = idsParam.split(",").map((s) => s.trim()).filter(Boolean);
    if (!tokens.length) {
      res.json([]);
      return;
    }

    const objIds = tokens.filter((t) => Types.ObjectId.isValid(t));
    const slugs  = tokens.filter((t) => !Types.ObjectId.isValid(t));

    const items = await EV.find({
      $or: [
        objIds.length ? { _id: { $in: objIds } } : undefined,
        slugs.length ? { slug: { $in: slugs } } : undefined,
      ].filter(Boolean) as any,
    });

    res.json(items);
  } catch {
    res.status(500).json({ message: "Failed to fetch compare data" });
  }
};
router.get("/compare", compare);

// GET /api/evs/:slug
const bySlug: RequestHandler = async (req, res) => {
  try {
    const ev = await EV.findOne({ slug: req.params.slug });
    if (!ev) {
      res.status(404).json({ message: "Not found" });
      return;
    }
    res.status(200).json(ev);
  } catch {
    res.status(500).json({ message: "Failed to fetch EV" });
  }
};
router.get("/:slug", bySlug);

export default router;
