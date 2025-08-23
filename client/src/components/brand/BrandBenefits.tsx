import { Link } from "react-router-dom";

export type BrandBenefitItem = {
  image: string;
  alt: string;
  title: string;
  text: string;
  linkLabel?: string;
  linkHref?: string;
};

export type BrandBenefitsProps = {
  title?: string;
  subtitle?: string;
  items: BrandBenefitItem[];
  theme?: {
    sectionBg?: string;
    text?: string;
    link?: string;
  };
};

export default function BrandBenefits({
  title,
  subtitle,
  items,
  theme = {},
}: BrandBenefitsProps) {
  const {
    sectionBg = "bg-wh-10",
    text = "text-wh-100",
    link = "text-price",
  } = theme;

  return (
    <section className={`${sectionBg} py-12 sm:py-16`}>
      <div className="mx-auto max-w-[2580px] px-6 sm:px-10 md:px-16 lg:px-24">
        
        {title && <h2 className="text-3xl sm:text-4xl font-semibold">{title}</h2>}
        {subtitle && <p className="mt-3 text-lg sm:text-xl text-primary opacity-80">{subtitle}</p>}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
          {items.map((it, i) => (
            <article key={i} className={`flex flex-col ${text}`}>
              <div className="rounded-xl overflow-hidden shadow-sm">
                <img
                  src={new URL((it.image), import.meta.url).href}
                  alt={it.alt}
                  className="w-full aspect-[4/3] object-cover"
                  loading={i > 0 ? "lazy" : "eager"}
                />
              </div>

              <h3 className="mt-6 text-3xl text-primary font-semibold tracking-tight">
                {it.title}
              </h3>

              <p className="mt-3 text-xl text-primary leading-relaxed opacity-80">
                {it.text}
              </p>

              {it.linkHref && it.linkLabel && (
                <Link
                  to={it.linkHref}
                  className={`mt-4 inline-flex items-center gap-1 font-medium ${link}`}
                >
                  {it.linkLabel} <span aria-hidden="true">↗</span>
                </Link>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
