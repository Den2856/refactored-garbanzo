export type StatItem = { value: string; label: string; note?: string };
export type BrandStatsProps = {
  title?: string;
  subtitle?: string;
  items: StatItem[];
};

export default function BrandStats({ title, subtitle, items }: BrandStatsProps) {
  return (
    <section className="bg-wh-50 py-12 sm:py-16">
      <div className="mx-auto max-w-[1680px] px-6 sm:px-10 md:px-16 lg:px-24">

        {title && <h2 className="text-3xl sm:text-4xl font-semibold">{title}</h2>}
        {subtitle && <p className="mt-3 text-lg sm:text-xl opacity-80">{subtitle}</p>}

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 gap-6 xl:gap-8">
          {items.map((s, i) => (
            <div key={i} className="h-full rounded-2xl bg-white/90 shadow p-6 flex flex-col overflow-hidden">
              <div className="text-[clamp(28px,4vw,56px)] leading-tight font-semibold break-words">
                {s.value}
              </div>

              <div className="mt-2 text-lg">{s.label}</div>

              {s.note && (
                <div className="mt-auto pt-3 text-sm opacity-70">{s.note}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}