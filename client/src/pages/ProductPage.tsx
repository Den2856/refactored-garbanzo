// src/pages/ProductsPage.tsx
import React from "react"
import axios from "axios"
import EVCard, { type EV } from "../components/ui/EVCard" // <-- adjust path if needed
import { FiFilter, FiSearch, FiX, FiChevronDown } from "react-icons/fi"
import Header from "../components/Header"
import Spinner from "../components/ui/Spinner"

const API = import.meta.env.VITE_API_URL || "http://localhost:4002"

type ProductsPageProps = {
  brandKey?: string | null // optional preselected brand (e.g., "Tesla")
}

export default function ProductsPage({ brandKey = null }: ProductsPageProps) {
  const [items, setItems] = React.useState<EV[]>([])
  const [loading, setLoading] = React.useState(true)

  // filters
  const [query, setQuery] = React.useState("")
  const [brand, setBrand] = React.useState<string | null>(brandKey)
  const [body, setBody] = React.useState<string | null>(null)
  const [availability, setAvailability] =
    React.useState<"all" | "available" | "coming-soon">("all")
  const [sort, setSort] =
    React.useState<"popular" | "price-asc" | "price-desc" | "range-desc" | "rating-desc">("popular")
  const [openFilters, setOpenFilters] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false
    setLoading(true)
    axios
      .get<EV[]>(`${API}/api/evs`)
      .then(res => { if (!cancelled) setItems(res.data) })
      .catch(console.error)
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  // brand is first word of name (like your DetailsPage)
  const getBrand = (name: string) => name.split(" ")[0]

  const brands = React.useMemo(
    () => Array.from(new Set(items.map(i => getBrand(i.name)))).sort(),
    [items]
  )
  const bodies  = React.useMemo(
    () => Array.from(new Set(items.map(i => i.bodyStyle))).sort(),
    [items]
  )

  const filtered = items
    .filter(i => (availability === "all" ? true : (i as any).status === availability))
    .filter(i => (brand ? getBrand(i.name) === brand : true))
    .filter(i => (body ? i.bodyStyle === body : true))
    .filter(i =>
      query.trim()
        ? `${getBrand(i.name)} ${i.name}`.toLowerCase().includes(query.trim().toLowerCase())
        : true
    )

  const sorted = React.useMemo(() => {
    const arr = [...filtered]
    switch (sort) {
      case "price-asc":  return arr.sort((a,b) => a.price - b.price)
      case "price-desc": return arr.sort((a,b) => b.price - a.price)
      case "range-desc": return arr.sort((a,b) => b.rangeKm - a.rangeKm)
      case "rating-desc":return arr.sort((a,b) => (b.rating ?? 0) - (a.rating ?? 0))
      default:           return arr
    }
  }, [filtered, sort])

  function resetAll() {
    setQuery("")
    setBrand(brandKey ?? null)
    setBody(null)
    setAvailability("all")
    setSort("popular")
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <Spinner />
      </main>
    )
  }

  return (
    <>
      <Header />
      <main className="relative">
        {/* Search + quick filters */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="rounded-2xl border border-black/10 bg-white/90 p-4 shadow">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              {/* Search */}
              <div className="relative grow">
                <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search by brand or model"
                  className="w-full rounded-2xl border border-black/10 bg-white py-3 pl-10 pr-3 text-sm outline-none transition focus:border-black/20"
                />
              </div>

              {/* Mobile actions */}
              <div className="flex items-center gap-2 md:hidden">
                <button
                  onClick={() => setOpenFilters(true)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold"
                >
                  <FiFilter /> Filters
                </button>
                <button onClick={resetAll} className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold">
                  Reset
                </button>
              </div>

              {/* Desktop dropdowns */}
              <div className="hidden items-center gap-2 md:flex">
                <Select label={brand ?? "Brand"} onReset={() => setBrand(null)}>
                  {brands.map(b => (
                    <button key={b} className="w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-black/[0.04]" onClick={() => setBrand(b)}>
                      {b}
                    </button>
                  ))}
                </Select>

                <Select label={body ?? "Body type"} onReset={() => setBody(null)}>
                  {bodies.map(b => (
                    <button key={b} className="w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-black/[0.04]" onClick={() => setBody(b)}>
                      {b}
                    </button>
                  ))}
                </Select>

                <Select label={labelAvailability(availability)}>
                  {(["all","available","coming-soon"] as const).map(v => (
                    <button key={v} className="w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-black/[0.04]" onClick={() => setAvailability(v)}>
                      {labelAvailability(v)}
                    </button>
                  ))}
                </Select>

                <Select label={labelSort(sort)}>
                  {[
                    { v: "popular", t: "Popular first" },
                    { v: "price-asc", t: "Price: low to high" },
                    { v: "price-desc", t: "Price: high to low" },
                    { v: "range-desc", t: "Longest range" },
                    { v: "rating-desc", t: "Top rated" },
                  ].map(o => (
                    <button key={o.v} className="w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-black/[0.04]" onClick={() => setSort(o.v as any)}>
                      {o.t}
                    </button>
                  ))}
                </Select>

                <button onClick={resetAll} className="ml-2 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold">
                  Reset
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
          <div className="mb-4 text-sm">Found: <span className="font-semibold">{sorted.length}</span></div>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sorted.map((ev, i) => (
              <div key={ev._id} className="h-full">
                {/* IMPORTANT: pass ev prop, EVCard expects { ev } */}
                <EVCard ev={ev} idx={i} />
              </div>
            ))}
          </div>
        </section>

        {/* Mobile filters drawer */}
        {openFilters && (
          <FiltersDrawer
            brands={brands}
            bodies={bodies}
            brand={brand}
            body={body}
            availability={availability}
            sort={sort}
            setBrand={setBrand}
            setBody={setBody}
            setAvailability={setAvailability}
            setSort={setSort}
            onClose={() => setOpenFilters(false)}
            resetAll={resetAll}
            count={sorted.length}
          />
        )}
      </main>
    </>
  )
}

/* ---------- small UI helpers (no global style changes) ---------- */

function Select({
  label,
  children,
  onReset,
}: {
  label: string
  children: React.ReactNode
  onReset?: () => void
}) {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold"
      >
        {label} <FiChevronDown className={`transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute left-0 z-20 mt-2 min-w-52 overflow-hidden rounded-2xl border border-black/10 bg-white p-1 shadow-xl">
          <div className="max-h-64 overflow-y-auto p-1">{children}</div>
          {onReset && (
            <div className="border-t border-black/10 p-1">
              <button className="w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-black/[0.04]" onClick={onReset}>
                Reset
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function FiltersDrawer(props: {
  brands: string[]
  bodies: string[]
  brand: string | null
  body: string | null
  availability: "all" | "available" | "coming-soon"
  sort: "popular" | "price-asc" | "price-desc" | "range-desc" | "rating-desc"
  setBrand: (v: string | null) => void
  setBody: (v: string | null) => void
  setAvailability: (v: "all" | "available" | "coming-soon") => void
  setSort: (v: "popular" | "price-asc" | "price-desc" | "range-desc" | "rating-desc") => void
  onClose: () => void
  resetAll: () => void
  count: number
}) {
  const {
    brands, bodies, brand, body, availability, sort,
    setBrand, setBody, setAvailability, setSort, onClose, resetAll, count
  } = props
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] rounded-t-3xl border border-black/10 bg-white p-4 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-semibold">Filters</div>
          <button onClick={onClose} className="rounded-full border border-black/10 p-2">
            <FiX />
          </button>
        </div>

        <div className="space-y-5 overflow-y-auto pb-4">
          <Field label="Brand">
            <div className="flex flex-wrap gap-2">
              {brands.map(b => (
                <Chip key={b} active={brand === b} onClick={() => setBrand(brand === b ? null : b)}>{b}</Chip>
              ))}
            </div>
          </Field>

          <Field label="Body type">
            <div className="flex flex-wrap gap-2">
              {bodies.map(b => (
                <Chip key={b} active={body === b} onClick={() => setBody(body === b ? null : b)}>{b}</Chip>
              ))}
            </div>
          </Field>

          <Field label="Availability">
            <div className="flex flex-wrap gap-2">
              {(["all","available","coming-soon"] as const).map(v => (
                <Chip key={v} active={availability === v} onClick={() => setAvailability(v)}>
                  {labelAvailability(v)}
                </Chip>
              ))}
            </div>
          </Field>

          <Field label="Sort by">
            <div className="flex flex-wrap gap-2">
              {[
                { v: "popular", t: "Popular" },
                { v: "price-asc", t: "Price ↑" },
                { v: "price-desc", t: "Price ↓" },
                { v: "range-desc", t: "Range ↓" },
                { v: "rating-desc", t: "Rating ↓" },
              ].map(o => (
                <Chip key={o.v} active={sort === (o.v as any)} onClick={() => setSort(o.v as any)}>
                  {o.t}
                </Chip>
              ))}
            </div>
          </Field>

          <div className="flex gap-2">
            <button onClick={onClose} className="grow rounded-2xl bg-black text-white px-4 py-3 text-sm font-semibold">
              Show ({count})
            </button>
            <button onClick={resetAll} className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold">
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide opacity-60">{label}</div>
      {children}
    </div>
  )
}

function Chip({ active, onClick, children }: { active?: boolean; onClick?: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl px-3 py-1.5 text-sm border ${
        active ? "border-black bg-black text-white" : "border-black/10 bg-white hover:bg-black/[0.04]"
      }`}
    >
      {children}
    </button>
  )
}

/* ---------- labels ---------- */
function labelAvailability(v: "all" | "available" | "coming-soon") {
  if (v === "available") return "Available now"
  if (v === "coming-soon") return "Coming soon"
  return "All"
}

function labelSort(v: string) {
  switch (v) {
    case "price-asc": return "Price: low to high"
    case "price-desc": return "Price: high to low"
    case "range-desc": return "Longest range"
    case "rating-desc": return "Top rated"
    default: return "Popular first"
  }
}
