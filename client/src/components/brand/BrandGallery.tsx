import React from "react";

export type BrandGalleryItem = { src: string; alt: string; caption: string; href?: string };

type ColSpan = 1 | 2 | 3;
type RowSpan = 1 | 2;

export type BrandGalleryProps = {
  title?: string;
  subtitle?: string;
  items: BrandGalleryItem[];
  layout?: "feature-left" | "feature-right";
  widthPattern?: ColSpan[];
  rowPattern?: RowSpan[];
  theme?: { sectionBg?: string; text?: string };
};

export default function BrandGallery({title, subtitle, items, layout = "feature-left", widthPattern, rowPattern, theme = {}, }: BrandGalleryProps) {
  
  const { sectionBg = "bg-wh-10", text = "text-wh-100" } = theme;

  const data = layout === "feature-right" && items.length > 1
    ? [items[1], items[2] ?? items[0], items[3] ?? items[0], items[0], ...items.slice(4)]
    : items;

  const wp: ColSpan[] = [
    (widthPattern?.[0] ?? 2) as ColSpan,
    (widthPattern?.[1] ?? 1) as ColSpan,
    (widthPattern?.[2] ?? 2) as ColSpan,
    (widthPattern?.[3] ?? 1) as ColSpan,
  ];
  const rp: RowSpan[] = [
    (rowPattern?.[0] ?? 2) as RowSpan,
    (rowPattern?.[1] ?? 2) as RowSpan,
    (rowPattern?.[2] ?? 2) as RowSpan,
    (rowPattern?.[3] ?? 1) as RowSpan,
  ];

  const spanCol = (n: ColSpan) => (n === 3 ? "md:col-span-3" : n === 2 ? "md:col-span-2" : "md:col-span-1");
  const spanRow = (n: RowSpan) => (n === 2 ? "md:row-span-2" : "md:row-span-1");

  const Card: React.FC<{ it: BrandGalleryItem; i: number; colSpan: ColSpan; rowSpan: RowSpan }> = ({ it, i, colSpan, rowSpan: rspan}) => (
    
    <article
      className={[
        "relative rounded-2xl overflow-hidden shadow-md h-[260px] md:h-full w-full",
        spanCol(colSpan),
        spanRow(rspan),
      ].join(" ")}
    >
      <img src={it.src} alt={it.alt} className="absolute inset-0 w-full h-full object-cover" loading={i > 1 ? "lazy" : "eager"} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className={`absolute left-4 right-4 bottom-4 ${text}`}>
        <p className="text-base sm:text-lg font-semibold drop-shadow">{it.caption}</p>
      </div>
    </article>
  );

  return (
    <section className={`${sectionBg} py-12 sm:py-16`}>
      <div className="mx-auto max-w-[2580px] px-6 sm:px-10 md:px-16 lg:px-24">
        
        {title && <h2 className="text-3xl sm:text-4xl font-semibold">{title}</h2>}
        {subtitle && <p className="mt-3 text-lg sm:text-xl opacity-80">{subtitle}</p>}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5 md:auto-rows-[320px] lg:auto-rows-[360px]">
          {data[0] && <Card it={data[0]} i={0} colSpan={wp[0]} rowSpan={rp[0]} />}
          {data[1] && <Card it={data[1]} i={1} colSpan={wp[1]} rowSpan={rp[1]} />}
          {data[2] && <Card it={data[2]} i={2} colSpan={wp[2]} rowSpan={rp[2]} />}
          {data[3] && <Card it={data[3]} i={3} colSpan={wp[3]} rowSpan={rp[3]} />}
        </div>
      </div>
    </section>
  );
}
