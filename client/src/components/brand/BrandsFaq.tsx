export type BrandFAQProps = {
  title?: string;
  items: { q: string; a: string }[];
};

export default function BrandFAQ({ title, items }: BrandFAQProps) {
  return (
    <section className="bg-wh-10 py-12 sm:py-16">
      <div className="mx-auto max-w-[2580px] px-6 sm:px-10 md:px-16 lg:px-24">
        {title && <h2 className="text-3xl sm:text-4xl font-semibold">{title}</h2>}
        <div className="mt-6 divide-y divide-black/10 rounded-2xl bg-white/90 shadow">
          {items.map((it, i) => (
            <details key={i} className="group p-5 open:bg-white open:rounded-2xl">
              <summary className="cursor-pointer text-lg font-medium list-none flex justify-between items-center">
                {it.q}
                <span className="ml-4 transition group-open:rotate-45">＋</span>
              </summary>
              <p className="mt-3 opacity-80">{it.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
