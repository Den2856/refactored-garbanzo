// server/src/routes/users.ts
import { Router, type Request, type Response, type RequestHandler } from "express";
import { requireAuth } from "../middleware/authMiddleware";
import User from "../models/user";
import EV from "../models/ev";
import { Types } from "mongoose";

const router = Router();

const isSelf = (req: Request, res: Response): boolean => {
  if (!req.user || req.user.id !== req.params.id) {
    res.sendStatus(403);
    return false;
  }
  return true;
};

/* ========================= FAVORITES ========================= */

const getFavorites: RequestHandler = async (req, res) => {
  if (!isSelf(req, res)) return;
  try {
    const userDoc = await User.findById(req.params.id).populate("favorites");
    if (!userDoc) {
      res.sendStatus(404);
      return;
    }
    res.json(userDoc.favorites);
  } catch {
    res.status(500).json({ message: "Failed to fetch favorites" });
  }
};

const addFavorite: RequestHandler = async (req, res) => {
  if (!isSelf(req, res)) return;
  try {
    const evDoc = await EV.findById(req.params.evId);
    if (!evDoc) {
      res.sendStatus(404);
      return;
    }
    await User.findByIdAndUpdate(req.params.id, { $addToSet: { favorites: evDoc._id } });
    res.sendStatus(204);
  } catch {
    res.status(500).json({ message: "Failed to add favorite" });
  }
};

const removeFavorite: RequestHandler = async (req, res) => {
  if (!isSelf(req, res)) return;
  try {
    await User.findByIdAndUpdate(req.params.id, { $pull: { favorites: req.params.evId } });
    res.sendStatus(204);
  } catch {
    res.status(500).json({ message: "Failed to remove favorite" });
  }
};

router.get("/:id/favorites", requireAuth, getFavorites);
router.post("/:id/favorites/:evId", requireAuth, addFavorite);
router.delete("/:id/favorites/:evId", requireAuth, removeFavorite);

/* ====================== SAVED SEARCHES ====================== */

const getSaved: RequestHandler = async (req, res) => {
  if (!isSelf(req, res)) return;
  try {
    const u = await User.findById(req.params.id).lean();
    res.json(u?.savedSearches ?? []);
  } catch {
    res.status(500).json({ message: "Failed to fetch saved searches" });
  }
};

const createSaved: RequestHandler = async (req, res) => {
  if (!isSelf(req, res)) return;
  const { name, query, href } = req.body ?? {};
  if (!name || !query || !href) {
    res.status(400).json({ message: "name, query, href required" });
    return;
  }
  try {
    const u = await User.findById(req.params.id);
    if (!u) {
      res.sendStatus(404);
      return;
    }
    (u.savedSearches as any[]).push({ name, query, href, updatedAt: new Date() } as any);
    await u.save();
    res.status(201).json((u.savedSearches as any[])[(u.savedSearches as any[]).length - 1]);
  } catch {
    res.status(500).json({ message: "Failed to create saved search" });
  }
};

const deleteSaved: RequestHandler = async (req, res) => {
  if (!isSelf(req, res)) return;
  try {
    const u = await User.findById(req.params.id);
    if (!u) {
      res.sendStatus(404);
      return;
    }
    const idx = (u.savedSearches as any[]).findIndex((s: any) => String(s._id) === req.params.sid);
    if (idx === -1) {
      res.sendStatus(404);
      return;
    }
    (u.savedSearches as any[]).splice(idx, 1);
    await u.save();
    res.sendStatus(204);
  } catch {
    res.status(500).json({ message: "Failed to delete saved search" });
  }
};

router.get("/:id/saved-searches", requireAuth, getSaved);
router.post("/:id/saved-searches", requireAuth, createSaved);
router.delete("/:id/saved-searches/:sid", requireAuth, deleteSaved);

/* ======================== PRICE ALERTS ====================== */

export const getAlerts: RequestHandler = async (req, res) => {
  if (!isSelf(req, res)) return;
  try {
    const u = await User.findById(req.params.id).populate("alerts.ev").lean();
    const items = (u?.alerts ?? []).map((a: any) => ({
      id: String(a._id),
      model: a.ev?.name ?? "",
      target: a.target,
      current: a.ev?.price ?? null,
      currency: a.currency ?? "$",
      active: !!a.active,
      href: a.ev?.slug ? `/evs/${a.ev.slug}` : undefined,
    }));
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch alerts" });
  }
};

export const createAlert: RequestHandler = async (req, res) => {
  if (!isSelf(req, res)) return;
  const { evId, target, currency } = req.body ?? {};
  if (!evId || typeof target !== "number") {
    res.status(400).json({ message: "evId (string) and target (number) are required" });
    return;
  }
  try {
    const ev = await EV.findById(evId).select("name price slug").lean();
    if (!ev) {
      res.status(404).json({ message: "EV not found" });
      return;
    }
    const u = await User.findById(req.params.id);
    if (!u) {
      res.sendStatus(404);
      return;
    }

    u.alerts.push({
      ev: evId,
      target: Number(target),
      currency: currency || "$",
      active: true,
      updatedAt: new Date(),
    } as any);

    await u.save();
    const created: any = u.alerts[u.alerts.length - 1];
    res.status(201).json({
      id: String(created._id),
      model: ev.name,
      target: created.target,
      current: ev.price ?? null,
      currency: created.currency,
      active: true,
      href: ev.slug ? `/evs/${ev.slug}` : undefined,
    });
  } catch (e) {
    res.status(500).json({ message: "Failed to create alert" });
  }
};

export const updateAlert: RequestHandler = async (req, res) => {
  if (!isSelf(req, res)) return;
  const { active, target, currency } = req.body ?? {};
  try {
    const u = await User.findById(req.params.id); // без lean — нужен сабдокумент
    if (!u) {
      res.sendStatus(404);
      return;
    }
    const node: any = (u as any).alerts.id(req.params.aid);
    if (!node) {
      res.sendStatus(404);
      return;
    }

    if (typeof active === "boolean") node.active = active;
    if (typeof target === "number") node.target = target;
    if (typeof currency === "string" && currency) node.currency = currency;
    node.set("updatedAt", new Date());

    await u.save();
    res.json({ ok: true, active: node.active, target: node.target, currency: node.currency });
  } catch (e) {
    res.status(500).json({ message: "Failed to update alert" });
  }
};

export const deleteAlert: RequestHandler = async (req, res) => {
  if (!isSelf(req, res)) return;
  try {
    const u = await User.findById(req.params.id);
    if (!u) {
      res.sendStatus(404);
      return;
    }
    const node = (u as any).alerts.id(req.params.aid);
    if (!node) {
      res.sendStatus(404);
      return;
    }
    node.deleteOne();
    await u.save();
    res.sendStatus(204);
  } catch (e) {
    res.status(500).json({ message: "Failed to delete alert" });
  }
};

router.get("/:id/alerts", requireAuth, getAlerts);
router.post("/:id/alerts", requireAuth, createAlert);
router.patch("/:id/alerts/:aid", requireAuth, updateAlert);
router.delete("/:id/alerts/:aid", requireAuth, deleteAlert);

/* ======================== COMPARE LIST ===================== */

const MAX_COMPARE = 3;

const getCompare: RequestHandler = async (req, res) => {
  if (!isSelf(req, res)) return;
  try {
    const u = await User.findById(req.params.id).populate("compare").lean();
    res.json(u?.compare ?? []);
  } catch {
    res.status(500).json({ message: "Failed to fetch compare list" });
  }
};

const addCompare: RequestHandler = async (req, res) => {
  if (!isSelf(req, res)) return;
  const { evId } = req.body ?? {};
  if (!evId) {
    res.status(400).json({ message: "evId required" });
    return;
  }
  try {
    const u = await User.findById(req.params.id);
    if (!u) {
      res.sendStatus(404);
      return;
    }
    const id = new Types.ObjectId(evId);
    u.compare = u.compare.filter((x: any) => x.toString() !== evId);
    u.compare.unshift(id);
    u.compare = u.compare.slice(0, MAX_COMPARE);
    await u.save();
    const full = await User.findById(u.id).populate("compare").lean();
    res.status(201).json(full?.compare ?? []);
  } catch {
    res.status(500).json({ message: "Failed to add to compare" });
  }
};

const removeCompare: RequestHandler = async (req, res) => {
  if (!isSelf(req, res)) return;
  try {
    const u = await User.findByIdAndUpdate(
      req.params.id,
      { $pull: { compare: req.params.evId } },
      { new: true }
    )
      .populate("compare")
      .lean();
    if (!u) {
      res.sendStatus(404);
      return;
    }
    res.json(u.compare ?? []);
  } catch {
    res.status(500).json({ message: "Failed to remove from compare" });
  }
};

const clearCompare: RequestHandler = async (req, res) => {
  if (!isSelf(req, res)) return;
  try {
    await User.updateOne({ _id: req.params.id }, { $set: { compare: [] } });
    res.sendStatus(204);
  } catch {
    res.status(500).json({ message: "Failed to clear compare" });
  }
};

router.get("/:id/compare", requireAuth, getCompare);
router.post("/:id/compare", requireAuth, addCompare);
router.delete("/:id/compare/:evId", requireAuth, removeCompare);
router.delete("/:id/compare", requireAuth, clearCompare);

/* ====================== RECENTLY VIEWED ==================== */

const getRecent: RequestHandler = async (req, res) => {
  if (!isSelf(req, res)) return;
  try {
    const u = await User.findById(req.params.id).populate("recent.ev").lean();
    const items = (u?.recent ?? [])
      .sort((a: any, b: any) => +new Date(b.at) - +new Date(a.at))
      .slice(0, 6)
      .map((r: any) => r.ev)
      .filter(Boolean);
    res.json(items);
  } catch {
    res.status(500).json({ message: "Failed to fetch recent" });
  }
};

const addRecent: RequestHandler = async (req, res) => {
  if (!isSelf(req, res)) return;
  const { evId } = req.body ?? {};
  if (!evId) {
    res.status(400).json({ message: "evId required" });
    return;
  }
  try {
    const u = await User.findById(req.params.id);
    if (!u) {
      res.sendStatus(404);
      return;
    }
    u.recent = [
      { ev: new Types.ObjectId(evId), at: new Date() } as any,
      ...u.recent.filter((r: any) => r.ev.toString() !== evId),
    ].slice(0, 6);
    await u.save();
    res.sendStatus(204);
  } catch {
    res.status(500).json({ message: "Failed to add recent" });
  }
};

router.get("/:id/recent", requireAuth, getRecent);
router.post("/:id/recent", requireAuth, addRecent);

export default router;
