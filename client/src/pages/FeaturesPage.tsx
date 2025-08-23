import {
  FiZap,
  FiBatteryCharging,
  FiShield,
  FiTruck,
  FiHeadphones,
  FiSliders,
  FiCheckCircle,
  FiMapPin,
  FiChevronsRight,
} from "react-icons/fi"

import Header from "../components/Header"

import BrandFAQ from "../components/brand/BrandsFaq";
import { Link } from "react-router-dom";

export default function FeaturesPage() {
  const features = [
    {
      icon: <FiZap className="size-6" />,
      title: "Instant Torque",
      desc: "Experience breathtaking acceleration with EVs tuned for city and highway driving.",
    },
    {
      icon: <FiBatteryCharging className="size-6" />,
      title: "Fast Charging",
      desc: "Top up 200–300 km in minutes at partner stations across the country.",
    },
    {
      icon: <FiShield className="size-6" />,
      title: "Full Insurance",
      desc: "Comprehensive coverage with roadside assistance 24/7 for your peace of mind.",
    },
    {
      icon: <FiTruck className="size-6" />,
      title: "Doorstep Delivery",
      desc: "We deliver and pick up your car wherever it’s most convenient for you.",
    },
    {
      icon: <FiHeadphones className="size-6" />,
      title: "Human Support",
      desc: "Talk to real people. Live chat and phone support in under 2 minutes on average.",
    },
    {
      icon: <FiSliders className="size-6" />,
      title: "Smart Filters",
      desc: "Find the perfect EV by range, body type, price and availability in one click.",
    },
  ]

  const steps = [
    {
      icon: <FiMapPin className="size-6" />,
      title: "Choose a city",
      desc: "Select your pickup location and dates to see real-time availability.",
    },
    {
      icon: <FiSliders className="size-6" />,
      title: "Filter & compare",
      desc: "Sort by range, price or body type. Compare specs side-by-side.",
    },
    {
      icon: <FiCheckCircle className="size-6" />,
      title: "Book & drive",
      desc: "One-click checkout. We’ll deliver a fully charged EV to you.",
    },
  ]

  const faqItems = [
    { q: "Do I need to pay a deposit?", a: "Yes, a small refundable deposit is charged at booking and returned after the trip." },
    { q: "Where can I charge the car?", a: "Use the in-app map of partner stations. Most locations support fast charging." },
    { q: "Can I cancel my booking?", a: "Yes, free cancellation up to 24 hours before the start time." },
  ];


  return (
    <main className="relative overflow-hidden">
      <Header />
      {/* Hero */}
      <section className="relative isolate mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="absolute -top-24 right-1/2 h-72 w-[60rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-emerald-400/20 to-sky-400/20 blur-3xl" />
        <div className="absolute -bottom-24 left-1/2 h-72 w-[60rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-sky-400/20 to-indigo-400/20 blur-3xl" />

        <div className="relative z-10 text-center">
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Everything you love about EVs — in one place
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Fast selection, transparent pricing, and thoughtful logistics. From city trips to weekend getaways — we’ll match an EV to your needs.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              to="/cars"
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Browse cars <FiChevronsRight />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Why us
            </a>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section id="features" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-900/90 text-white shadow-sm">
                {f.icon}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.desc}</p>
              <div className="pointer-events-none absolute -right-8 -top-8 size-24 rounded-full bg-gradient-to-br from-emerald-400/10 to-sky-400/10 opacity-0 blur-2xl transition group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </section>

      {/* Stats band */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 gap-4 rounded-3xl border border-slate-200 bg-white p-6 text-center sm:grid-cols-4">
          <Stat kpi="1200+" label="trips per month" />
          <Stat kpi="98%" label="5★ ratings" />
          <Stat kpi="250+" label="fast-charging stations" />
          <Stat kpi="12" label="cities served" />
        </div>
      </section>

      {/* Steps */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h2 className="text-center text-3xl font-bold text-slate-900 sm:text-4xl">How it works</h2>
        <div className="mt-8 grid gap-4 sm:gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={i} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 text-slate-900">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-900/90 text-white">
                  {s.icon}
                </div>
                <h3 className="text-lg font-semibold">{s.title}</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Insurance & Support */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid items-center gap-6 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 sm:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700">
              <FiShield /> Safety
            </div>
            <h3 className="mt-4 text-2xl font-bold text-slate-900">All-inclusive insurance</h3>
            <p className="mt-2 text-slate-600">
              Full coverage and roadside assistance while on the road. A dedicated manager resolves any issues quickly and clearly.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              <li className="flex items-center gap-2"><FiCheckCircle className="text-emerald-600" /> 24/7 support</li>
              <li className="flex items-center gap-2"><FiCheckCircle className="text-emerald-600" /> Replacement vehicle</li>
              <li className="flex items-center gap-2"><FiCheckCircle className="text-emerald-600" /> Zero deductible on damages</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="rounded-xl bg-slate-50 p-4"><div className="text-2xl font-bold text-slate-900">≤ 10 min</div><div className="mt-1 text-xs text-slate-600">avg. assistance wait</div></div>
              <div className="rounded-xl bg-slate-50 p-4"><div className="text-2xl font-bold text-slate-900">99.3%</div><div className="mt-1 text-xs text-slate-600">incident-free trips</div></div>
              <div className="rounded-xl bg-slate-50 p-4"><div className="text-2xl font-bold text-slate-900">0</div><div className="mt-1 text-xs text-slate-600">hidden fees</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
        <h2 className="text-center text-3xl font-bold text-slate-900 sm:text-4xl">Customer reviews</h2>
        <div className="mt-8 grid gap-4 sm:gap-6 md:grid-cols-3">
          {[
            {
              name: "Alex",
              text: "Delivered on time, and one charge lasted the whole day. Service was top-notch.",
            },
            {
              name: "Marina",
              text: "The filters are handy — quickly found a compact sedan for the city.",
            },
            {
              name: "Ivan",
              text: "Support helped instantly with charging on the highway. Recommended!",
            },
          ].map((t, i) => (
            <blockquote key={i} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div>
                  <div className="font-semibold text-slate-900">{t.name}</div>
                  <div className="text-xs text-slate-500">5★ trip</div>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">{t.text}</p>
            </blockquote>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-center text-3xl font-bold text-slate-900 sm:text-4xl">FAQ</h2>
        <div className="mt-8 divide-y divide-slate-200 rounded-3xl border border-slate-200 bg-white">
          <BrandFAQ items={faqItems} />

        </div>

        <div className="mt-10 text-center">
          <Link to="/cars" className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:-translate-y-0.5 hover:shadow-xl">
            Browse cars <FiChevronsRight />
          </Link>
        </div>
      </section>
    </main>
  )
}

function Stat({ kpi, label }: { kpi: string; label: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="text-2xl font-bold text-slate-900">{kpi}</div>
      <div className="mt-1 text-xs text-slate-600">{label}</div>
    </div>
  )
}
