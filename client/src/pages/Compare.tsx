// src/pages/ComparePage.tsx
import { useEffect, useMemo, useState, type ReactNode } from "react";
import Header from "../components/Header";
import Spinner from "../components/ui/Spinner";
import { useAuth } from "../context/AuthContext";
import { X, Trash2, AlertCircle } from "lucide-react";
import type { EV } from "../components/ui/EVCard";
import { Link } from "react-router";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function ComparePage() {
  const { user, token, isAuthenticated, loading: authLoading } = useAuth();

  const [items, setItems] = useState<EV[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDiffOnly, setShowDiffOnly] = useState(false);
  const [busyClear, setBusyClear] = useState(false);

  useEffect(() => {
    if (!user || !token) return;
    const headers = { Authorization: `Bearer ${token}` };
    fetch(`${API}/api/users/${user.id}/compare`, { headers })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setItems(data as EV[]))
      .finally(() => setLoading(false));
  }, [user, token]);

  async function removeOne(evId: string) {
    if (!user || !token) return;
    const ok = await fetch(`${API}/api/users/${user.id}/compare/${evId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }).then((r) => r.ok);
    if (ok) setItems((arr) => arr.filter((x) => x._id !== evId));
  }

  async function clearAll() {
    if (!user || !token || items.length === 0) return;
    setBusyClear(true);
    await Promise.all(
      items.map((ev) =>
        fetch(`${API}/api/users/${user.id}/compare/${ev._id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        })
      )
    );
    setItems([]);
    setBusyClear(false);
  }

  const ready = !authLoading && isAuthenticated && !loading;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-[1680px] px-6 sm:px-10 md:px-16 lg:px-24 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold">Compare</h1>
            <p className="text-gray-500">
              {items.length} {items.length === 1 ? "vehicle" : "vehicles"} selected
            </p>
          </div>
          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="size-4 accent-black"
                checked={showDiffOnly}
                onChange={(e) => setShowDiffOnly(e.target.checked)}
              />
              Show differences only
            </label>
            <button
              onClick={clearAll}
              disabled={items.length === 0 || busyClear}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black text-white disabled:opacity-40"
            >
              <Trash2 size={16} /> Clear all
            </button>
          </div>
        </div>

        {!ready ? (
          <div className="mt-12">
            <Spinner />
          </div>
        ) : items.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* mobile: stack cards */}
            <section className="sm:hidden mt-6 grid grid-cols-1 gap-4">
              {items.map((ev) => (
                <MobileCard key={ev._id} ev={ev} onRemove={() => removeOne(ev._id)} />
              ))}
            </section>

            {/* desktop/tablet: spec table */}
            <section className="hidden sm:block mt-6">
              <SpecTable
                items={items}
                onRemove={removeOne}
                showDiffOnly={showDiffOnly}
              />
            </section>
          </>
        )}
      </main>
    </>
  );
}

/* ===================== helper UI ===================== */

function EmptyState() {
  return (
    <div className="mt-12 rounded-2xl border p-8 bg-white">
      <div className="flex items-start gap-3">
        <AlertCircle className="text-gray-500 mt-1" />
        <div>
          <h3 className="text-lg font-semibold">Your compare list is empty</h3>
          <p className="text-gray-500 mt-1">
            Open any model page and press <b>Compare</b> to add it here.
          </p>
          <Link
            to="/cars"
            className="mt-4 inline-flex items-center px-4 py-2 rounded-xl bg-black text-white"
          >
            Browse models
          </Link>
        </div>
      </div>
    </div>
  );
}

function MobileCard({ ev, onRemove }: { ev: EV; onRemove: () => void }) {
  return (
    <article className="rounded-2xl border bg-white overflow-hidden">
      <div className="flex justify-between items-start p-4">
        <div>
          <h3 className="text-lg font-semibold">{ev.name}</h3>
        </div>
        <button
          onClick={onRemove}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
          title="Remove"
        >
          <X size={16} />
        </button>
      </div>
      {ev.images?.[0] && (
        <img
          src={`/src/assets/evs/${ev.images[0]}`}
          alt={ev.name}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
      )}
      <ul className="divide-y text-sm">
        <li className="flex justify-between p-4">
          <span className="text-gray-500">Price</span>
          <b>${ev.price.toLocaleString()}</b>
        </li>
        <li className="flex justify-between p-4">
          <span className="text-gray-500">Range</span>
          <b>{ev.rangeKm} km</b>
        </li>
        <li className="flex justify-between p-4">
          <span className="text-gray-500">Transmission</span>
          <b>{ev.transmission}</b>
        </li>
        <li className="flex justify-between p-4">
          <span className="text-gray-500">Body style</span>
          <b>{ev.bodyStyle}</b>
        </li>
        <li className="flex justify-between p-4">
          <span className="text-gray-500">Rating</span>
          <b>
            {ev.rating.toFixed(1)} ({ev.reviewsCount})
          </b>
        </li>
        <li className="flex justify-between p-4">
          <span className="text-gray-500">Availability</span>
          <b>{ev.available ? "Available" : "Pre-order"}</b>
        </li>
      </ul>
      <div className="p-4">
        <Link
          to={`/evs/${ev.slug}`}
          className="inline-flex items-center px-4 py-2 rounded-xl bg-black text-white w-full justify-center"
        >
          View details
        </Link>
      </div>
    </article>
  );
}

function SpecTable({
  items,
  onRemove,
  showDiffOnly,
}: {
  items: EV[];
  onRemove: (id: string) => void;
  showDiffOnly: boolean;
}) {
  const cols = items.length;
  const tcols = `260px repeat(${cols}, minmax(240px, 1fr))`;

  // набор спецификаций
  type Row = { key: string; label: string; get: (ev: EV) => ReactNode };
  const rows: Row[] = useMemo(
    () => [
      { key: "price", label: "Price", get: (e) => `$${e.price.toLocaleString()}` },
      { key: "range", label: "Range (WLTP)", get: (e) => `${e.rangeKm} km` },
      { key: "release", label: "Year of release", get: (e) => e.yearOfRelease },
      { key: "trans", label: "Transmission", get: (e) => e.transmission },
      { key: "body", label: "Body style", get: (e) => e.bodyStyle },
      { key: "rating", label: "Rating", get: (e) => `${e.rating.toFixed(1)} (${e.reviewsCount})` },
      { key: "avail", label: "Availability", get: (e) => (e.available ? "Available" : "Pre-order") },
      { key: "eta", label: "ETA to store", get: (e) => `${e.etaMinutes} min` },
      { key: "distance", label: "Distance to store", get: (e) => `${e.distanceMeters} m` },
      { key: "desc", label: "Description", get: (e) => <span className="text-sm text-gray-600">{e.description}</span> },
    ],
    []
  );

  const allEqual = (values: ReactNode[]) => {
    const primitives = values.every((v) => typeof v === "string" || typeof v === "number");
    if (primitives) {
      const first = String(values[0] ?? "");
      return values.every((v) => String(v ?? "") === first);
    }
    return false;
  };

  return (
    <div className="rounded-2xl border overflow-x-auto bg-white shadow-sm">
      
      <div className="grid gap-px bg-gray-200 sticky top-0 z-10" style={{ gridTemplateColumns: tcols }}>
        <div className="bg-white p-4 font-semibold">Model</div>
        {items.map((ev) => (
          <div key={ev._id} className="bg-white p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="font-semibold truncate">{ev.name}</div>
                <div className="text-xs text-gray-500">
                  {ev.yearOfRelease} · {ev.bodyStyle}
                </div>
              </div>
              <button
                onClick={() => onRemove(ev._id)}
                className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                title="Remove"
              >
                <X size={16} />
              </button>
            </div>
            {ev.images?.[0] && (
              <img
                src={`/src/assets/evs/${ev.images[0]}`}
                alt={ev.name}
                className="w-full h-40 object-cover mt-3 rounded-md"
                loading="lazy"
              />
            )}
            <Link
              to={`/evs/${ev.slug}`}
              className="mt-3 inline-flex items-center px-3 py-2 rounded-lg bg-black text-white"
            >
              Details
            </Link>
          </div>
        ))}
      </div>

      {/* spec rows */}
      <div className="grid gap-px bg-gray-200" style={{ gridTemplateColumns: tcols }}>
        {rows.map((row) => {
          const vals = items.map((e) => row.get(e));
          const equal = allEqual(vals);
          if (showDiffOnly && equal) return null;

          return (
            <div className="contents" key={row.key}>
              <div className="bg-gray-50 p-4 text-sm text-gray-600 sticky left-0 z-10">{row.label}</div>
              {items.map((ev, i) => {
                const val = vals[i];
                return (
                  <div
                    key={`${row.key}-${ev._id}`}
                    className={`bg-white p-4 text-sm ${!equal ? "bg-orange-100" : ""}`}
                  >
                    {val as ReactNode}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
