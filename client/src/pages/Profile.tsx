// src/pages/ProfilePage.tsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/ui/Spinner";
import SectionTitle from "../components/ui/SectionTitle";
import EVCard, { type EV } from "../components/ui/EVCard";
import Header from "../components/Header";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { toast } from "../components/ui/NotificationToaster";
import { Trash2, Pause, Play } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

type SavedSearch = { _id: string; name: string; query: string; updatedAt: string; href: string };
type PriceAlert = {
  id: string;
  model: string;
  target: number;
  current: number | null;
  currency: "$" | "€" | "₽" | string;
  active: boolean;
  href?: string;
};
type KPI = { label: string; value: number | string; href?: string };

/* ---------- motion variants ---------- */
const V_EMPTY: Variants = {};
const stagger = (delayChildren = 0.06, staggerChildren = 0.06): Variants => ({
  hidden: {},
  show: { transition: { delayChildren, staggerChildren } },
});
const item = (y = 16): Variants => ({
  hidden: { opacity: 0, y },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
});

export default function ProfilePage() {
  const { user, token, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const prefersReduced = useReducedMotion();

  const [favorites, setFavorites] = useState<EV[]>([]);
  const [saved, setSaved] = useState<SavedSearch[]>([]);
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [compare, setCompare] = useState<EV[]>([]);
  const [recent, setRecent] = useState<EV[]>([]);
  const [loading, setLoading] = useState(true);

  // redirect guest -> /login
  useEffect(() => {
    if (!authLoading && !isAuthenticated) navigate("/login");
  }, [authLoading, isAuthenticated, navigate]);

  // load all data
  useEffect(() => {
    if (!user || !token) {
      setLoading(false);
      return;
    }
    const headers = { Authorization: `Bearer ${token}` };
    Promise.allSettled([
      fetch(`${API}/api/users/${user.id}/favorites`, { headers }).then((r) => (r.ok ? r.json() : [])),
      fetch(`${API}/api/users/${user.id}/saved-searches`, { headers }).then((r) => (r.ok ? r.json() : [])),
      fetch(`${API}/api/users/${user.id}/alerts`, { headers }).then((r) => (r.ok ? r.json() : [])),
      fetch(`${API}/api/users/${user.id}/compare`, { headers }).then((r) => (r.ok ? r.json() : [])),
      fetch(`${API}/api/users/${user.id}/recent`, { headers }).then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([fav, sav, al, cmp, rec]) => {
        if (fav.status === "fulfilled") setFavorites(fav.value as EV[]);
        if (sav.status === "fulfilled") setSaved(sav.value as SavedSearch[]);
        if (al.status === "fulfilled") setAlerts(al.value as PriceAlert[]);
        if (cmp.status === "fulfilled") setCompare(cmp.value as EV[]);
        if (rec.status === "fulfilled") setRecent(rec.value as EV[]);
      })
      .finally(() => setLoading(false));
  }, [user, token]);

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const kpis: KPI[] = useMemo(
    () => [
      { label: "Favorites", value: favorites.length, href: "#favorites" },
      { label: "Saved searches", value: saved.length, href: "#saved" },
      { label: "Price alerts", value: alerts.length, href: "#alerts" },
      { label: "Compare list", value: compare.length, href: "#compare" },
      { label: "Member since", value: memberSince || "—" },
    ],
    [favorites.length, saved.length, alerts.length, compare.length, memberSince]
  );

  const isBusy = authLoading || loading || !user;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-[1680px] px-6 sm:px-10 md:px-16 lg:px-24 py-8 space-y-10">
        {isBusy ? (
          <Spinner />
        ) : (
          <>
            <OverviewBar items={kpis} />

            {/* Favorites */}
            <section id="favorites">
              <SectionTitle className="mt-2" title="My Favorites" label="it`s almost yours" />
              {favorites.length === 0 ? (
                <p className="text-gray-500 mt-2">You haven’t added any favorites yet.</p>
              ) : (
                <motion.div
                  variants={prefersReduced ? V_EMPTY : stagger()}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4"
                >
                  {favorites.map((ev, idx) => (
                    <motion.div key={ev._id} variants={prefersReduced ? V_EMPTY : item(14)}>
                      <EVCard ev={ev} idx={idx} animate={false} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </section>

            {/* Saved searches (with delete) */}
            <SavedSearches
              id="saved"
              items={saved}
              onDeleted={(sid) => setSaved((arr) => arr.filter((s) => s._id !== sid))}
            />

            {/* Price alerts (pause/resume + delete) */}
            <PriceAlerts
              id="alerts"
              items={alerts}
              onDeleted={(aid) => setAlerts((arr) => arr.filter((a) => a.id !== aid))}
              onToggled={(aid, active) =>
                setAlerts((arr) => arr.map((a) => (a.id === aid ? { ...a, active } : a)))
              }
            />

            {/* Compare */}
            <section id="compare" className="bg-wh-10 py-8 rounded-2xl">
              <div>
                <h3 className="text-2xl font-semibold">Compare list</h3>
                {compare.length === 0 ? (
                  <p className="mt-3 opacity-70">Nothing to compare yet.</p>
                ) : (
                  <>
                    <motion.ul
                      variants={prefersReduced ? V_EMPTY : stagger()}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                      className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                      {compare.map((ev, idx) => (
                        <motion.li key={`cmp-${ev._id}-${idx}`} variants={prefersReduced ? V_EMPTY : item(14)}>
                          <EVCard ev={ev} idx={idx} animate={false} />
                        </motion.li>
                      ))}
                    </motion.ul>
                    <Link
                      to="/compare"
                      className="mt-4 inline-flex items-center rounded-xl px-5 py-3 bg-price hover:bg-orange-400 text-wh-100 font-semibold"
                    >
                      Compare now
                    </Link>
                  </>
                )}
              </div>
            </section>

            {/* Recently viewed */}
            {recent.length > 0 && (
              <section className="bg-wh-10 py-8 rounded-2xl">
                <div>
                  <h3 className="text-2xl font-semibold">Recently viewed</h3>
                  <motion.div
                    variants={prefersReduced ? V_EMPTY : stagger()}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4"
                  >
                    {recent.map((ev, idx) => (
                      <motion.div key={`recent-${ev._id}-${idx}`} variants={prefersReduced ? V_EMPTY : item(14)}>
                        <EVCard ev={ev} idx={idx} animate={false} />
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </>
  );
}

/* ===== subcomponents ===== */

function OverviewBar({ items }: { items: KPI[] }) {
  const prefersReduced = useReducedMotion();
  return (
    <section className="py-2">
      <motion.div
        variants={prefersReduced ? V_EMPTY : stagger(0.02, 0.04)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
      >
        {items.map((k, i) => (
          <motion.a
            key={i}
            href={k.href || "#"}
            variants={prefersReduced ? V_EMPTY : item(8)}
            className="rounded-2xl bg-white/90 shadow p-4 hover:shadow-md transition"
          >
            <div className="text-[clamp(20px,3vw,32px)] leading-tight">{k.value}</div>
            <div className="text-sm opacity-70">{k.label}</div>
          </motion.a>
        ))}
      </motion.div>
    </section>
  );
}


function SavedSearches({
  items,
  id,
  onDeleted,
}: {
  items: SavedSearch[];
  id?: string;
  onDeleted: (sid: string) => void;
}) {
  const prefersReduced = useReducedMotion();
  const { user, token } = useAuth();

  async function handleDelete(sid: string) {
    if (!user || !token) return;
    try {
      const r = await fetch(`${API}/api/users/${user.id}/saved-searches/${sid}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!r.ok) throw new Error();
      onDeleted(sid);
      toast({ variant: "success", message: "Saved search deleted" });
    } catch {
      toast({ variant: "error", message: "Failed to delete saved search" });
    }
  }

  return (
    <section id={id} className="bg-wh-10 py-8 rounded-2xl">
      <div>
        <h3 className="text-2xl font-semibold">Saved searches</h3>
        {items.length === 0 ? (
          <p className="mt-3 opacity-70">No saved searches yet.</p>
        ) : (
          <motion.ul
            variants={prefersReduced ? {} : { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {items.map((s) => (
              <motion.li
                key={s._id}
                variants={prefersReduced ? {} : { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                className="rounded-xl bg-white/90 shadow p-4 overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{s.name}</div>
                    <div className="text-xs opacity-60 break-words">{s.query}</div>
                    <div className="text-xs opacity-60 mt-1">
                      Updated: {new Date(s.updatedAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* actions */}
                  <div className="flex w-full sm:w-auto items-center gap-2 flex-wrap">
                    <Link
                      to={s.href}
                      className="inline-flex justify-center items-center px-4 py-2 rounded-lg bg-price text-white hover:bg-orange-400 w-full sm:w-auto"
                    >
                      Open
                    </Link>
                    <button
                      onClick={() => handleDelete(s._id)}
                      className="inline-flex justify-center items-center gap-2 px-3 py-2 rounded-lg bg-black/5 hover:bg-black/10 w-full sm:w-auto"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                      <span className="sm:hidden">Delete</span>
                    </button>
                  </div>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>
    </section>
  );
}


function PriceAlerts({
  items,
  id,
  onDeleted,
  onToggled,
}: {
  items: PriceAlert[];
  id?: string;
  onDeleted: (aid: string) => void;
  onToggled: (aid: string, active: boolean) => void;
}) {
  const prefersReduced = useReducedMotion();
  const { user, token } = useAuth();

  async function handleToggle(aid: string, toActive: boolean) {
    if (!user || !token) return;
    try {
      const r = await fetch(`${API}/api/users/${user.id}/alerts/${aid}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ active: toActive }),
      });
      if (!r.ok) throw new Error();
      onToggled(aid, toActive);
      toast({ variant: "info", message: toActive ? "Alert resumed" : "Alert paused" });
    } catch {
      toast({ variant: "error", message: "Failed to update alert" });
    }
  }

  async function handleDelete(aid: string) {
    if (!user || !token) return;
    try {
      const r = await fetch(`${API}/api/users/${user.id}/alerts/${aid}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!r.ok) throw new Error();
      onDeleted(aid);
      toast({ variant: "success", message: "Alert deleted" });
    } catch {
      toast({ variant: "error", message: "Failed to delete alert" });
    }
  }

  return (
    <section id={id} className="bg-wh-10 py-8 rounded-2xl">
      <div>
        <h3 className="text-2xl font-semibold">Price alerts</h3>
        {items.length === 0 ? (
          <p className="mt-3 opacity-70">You have no active alerts.</p>
        ) : (
          <motion.div
            variants={prefersReduced ? {} : { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            {items.map((a) => {
              const hit = a.current !== null && a.current <= a.target;
              return (
                <motion.article
                  key={a.id}
                  variants={prefersReduced ? {} : { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                  className="rounded-2xl bg-white/90 shadow p-4 overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="font-medium truncate">{a.model}</div>
                    <span
                      className={`text-xs px-2 py-1 rounded-md self-start sm:self-auto ${
                        a.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {a.active ? "Active" : "Paused"}
                    </span>
                  </div>

                  <div className="mt-2 text-sm break-words">
                    Target: <b>{a.currency}{a.target.toLocaleString()}</b> · Current:{" "}
                    <b className={hit ? "text-green-600" : ""}>
                      {a.current === null ? "—" : `${a.currency}${a.current.toLocaleString()}`}
                    </b>
                  </div>

                  {/* actions */}
                  <div className="mt-3 flex flex-col sm:flex-row gap-2 flex-wrap">
                    {a.href && (
                      <Link
                        to={a.href}
                        className="inline-flex justify-center items-center px-4 py-2 rounded-lg bg-price text-white hover:bg-orange-400 w-full sm:w-auto"
                      >
                        View offers
                      </Link>
                    )}
                    <button
                      onClick={() => handleToggle(a.id, !a.active)}
                      className="inline-flex justify-center items-center gap-2 px-4 py-2 rounded-lg bg-black/5 hover:bg-black/10 w-full sm:w-auto"
                    >
                      {a.active ? <Pause size={16} /> : <Play size={16} />}
                      {a.active ? "Pause" : "Resume"}
                    </button>
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="inline-flex justify-center items-center gap-2 px-4 py-2 rounded-lg bg-black/5 hover:bg-black/10 w-full sm:w-auto"
                      title="Delete alert"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}