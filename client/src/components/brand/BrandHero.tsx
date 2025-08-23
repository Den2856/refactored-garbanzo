import { useRef, useState, useEffect } from "react";
import { FilterButtons } from "./FilterButtons";
import { Link } from "react-router-dom";

type Cta = { label: string; href: string; variant?: "primary" | "secondary" };
type HeroMedia =
  | { kind: "image"; src: string; alt?: string }
  | { kind: "video"; src: string; poster?: string; muted?: boolean; loop?: boolean; autoPlay?: boolean };

export type BrandHeroProps = {
  brand: string;
  headline: string[];
  subheading?: string;
  ctas?: Cta[];
  media: HeroMedia;
  tabs?: { label: string; href: string }[];
  overlay?: boolean;
  theme?: {
    text?: string;
    primary?: string;
    tabBg?: string;
    tabActive?: string;
  };
};

export default function BrandHero({
  brand,
  headline,
  subheading,
  ctas = [],
  media,
  tabs = [],
  overlay = true,

}: BrandHeroProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(media.kind === "video" ? media.autoPlay !== false : false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedTab, setSelectedTab] = useState(tabs[0]?.label || "Mercedes-Benz");

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", () => {
      setIsMobile(window.innerWidth <= 768);
    });
    return () => window.removeEventListener("resize", () => {});
  }, []);

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (playing) videoRef.current.pause();
    else videoRef.current.play().catch(() => {});
    setPlaying(!playing);
  };


  return (
    <section className="relative w-full h-[72vh] min-h-[520px] overflow-hidden">
      {media.kind === "image" ? (
        <img src={media.src} alt={media.alt ?? brand} className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src={media.src}
          poster={media.poster}
          muted={media.muted ?? true}
          loop={media.loop ?? true}
          autoPlay={media.autoPlay ?? true}
          playsInline
        />
      )}

      {overlay && <div className="absolute inset-0 bg-black/40" />}

      <div className="relative z-10 h-full grid">
        <div className="self-center px-6 sm:px-10 md:px-16 lg:px-24 max-w-3xl">
          <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight text-wh-100`}>
            {headline.map((line, i) => (
              <span key={i} className="block">{line}</span>
            ))}
          </h1>

          {subheading && <p className={`mt-6 text-lg sm:text-xl text-wh-50/90`}>{subheading}</p>}

          {ctas.length > 0 && (
            <div className="mt-8 flex gap-3">
              {ctas.map((c, i) => (
                <Link
                  key={i}
                  to={c.href}
                  className={
                    c.variant === "secondary"
                      ? "px-5 py-3 rounded-xl bg-secondary-btn-default hover:bg-secondary-btn-hover text-wh-100 font-medium pointer-events-none"
                      : `px-5 py-3 rounded-xl bg-price hover:bg-orange-400 text-wh-100 font-medium `
                  }
                >
                  {c.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="relative self-end w-full pb-5">
          <div className="flex items-center gap-4 px-6 sm:px-10 md:px-16 lg:px-24">
            {media.kind === "video" && !isMobile && (
              <button
                type="button"
                onClick={handlePlayPause}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-white/90 text-gray-90 transition-colors"
                aria-pressed={!playing}
              >
                {playing ? "❚❚ Pause" : "▶ Play"}
              </button>
            )}

            {tabs.length > 0 && (
              <FilterButtons
                tabs={tabs}
                selectedTab={selectedTab}
                onSelect={setSelectedTab}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
