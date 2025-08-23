import { Link } from "react-router-dom";

export type BrandBannerProps = {
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  bgImage: string;
  bgSize?: string;
  overlayOpacity?: number;
  align?: "left" | "right" | "center";
};

export default function BrandBanner({
  title,
  subtitle,
  ctaLabel,
  ctaHref = "#",
  bgImage,
  bgSize = "cover",
  overlayOpacity = 0.35,
  align = "left",
}: BrandBannerProps) {
  const alignClass =
    align === "right"
      ? "items-end text-right"
      : align === "center"
      ? "items-center text-center"
      : "items-start text-left";

  return (
    <section className="relative w-full text-white">
      {/* высота вынесена в внутренний контейнер, чтобы работали max-w и паддинги */}
      <div className="mx-auto">
        <div 
          className="relative h-[380px] sm:h-[440px] md:h-[560px] lg:h-[640px]"
          style={{ backgroundImage: `url(${bgImage})`, backgroundSize: bgSize, backgroundPosition: "center",}}
        >
          {/* overlay */}
          <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${overlayOpacity})` }} />
          <div className={`absolute inset-0 flex ${alignClass}`}>
            <div className="my-auto max-w-[760px] px-7">
              <h2 className="text-[32px] leading-[1.05] sm:text-[40px] lg:text-[54px] font-semibold tracking-tight">
                {title}
              </h2>
              {subtitle && (
                <p className="mt-4 text-base sm:text-lg lg:text-xl opacity-90">
                  {subtitle}
                </p>
              )}

              {ctaLabel && ctaHref && (
                <Link
                  to={ctaHref}
                  className="mt-6 inline-flex items-center justify-center rounded-xl px-5 py-3 bg-price hover:bg-orange-400 text-wh-100 font-semibold shadow-md transition"
                >
                  {ctaLabel}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
