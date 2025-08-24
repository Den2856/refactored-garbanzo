import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Star, MapPin, Settings, CarFront } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import StatusBadge from "./StatusBadge";

export interface EV {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  rangeKm: number;
  images: string[];
  available: boolean;
  rating: number;
  reviewsCount: number;
  distanceMeters: number;
  etaMinutes: number;
  transmission: "Manual" | "Automatic";
  bodyStyle: string;
  yearOfRelease: number;
}

export interface EVCardProps {
  ev: EV;
  idx?: number;
  animate?: boolean;
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      delay: Math.min(i, 24) * 0.06,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export default function EVCard({ ev, idx = 0, animate = true }: EVCardProps) {
  const prefersReduced = useReducedMotion();
  const [imgIndex, setImgIndex] = useState(0);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const pct = Math.min(1, Math.max(0, (e.clientX - left) / width));
    const next = Math.floor(pct * ev.images.length);
    setImgIndex(next >= ev.images.length ? ev.images.length - 1 : next);
  };
  const onMouseLeave = () => setImgIndex(0);

  const shouldAnimate = animate && !prefersReduced;

  return (
    <motion.div
      className="relative w-full space-y-4 bg-wh-100 rounded-2xl border overflow-hidden"
      variants={shouldAnimate ? cardVariants : undefined}
      custom={idx}
      initial={shouldAnimate ? "hidden" : false}
      whileInView={shouldAnimate ? "show" : undefined}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      style={{ willChange: "transform, opacity" }}
    >
      {/* Badge */}
      <StatusBadge available={ev.available} />

      {/* Image */}
      <div className="overflow-hidden" onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
        <img
          src={`/evs/${ev.images[imgIndex]}`}
          alt={ev.name}
          className="w-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between flex-wrap gap-y-4">
          <div className="flex-1 min-w-[150px]">
            <h3 className="text-2xl font-semibold text-primary uppercase w-fit">
              {ev.name}
            </h3>
            <p className="text-grey-800 text-[24px] w-fit">{ev.rangeKm} km range</p>
            <div className="flex items-baseline space-x-1 w-fit">
              <span className="text-price font-bold text-[24px]">
                ${ev.price.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-between items-end space-y-4">
            <Link
              to={`/evs/${ev.slug}`}
              className="bg-price text-white px-6 py-3 rounded-lg shadow-lg hover:opacity-90 transition-opacity duration-200"
            >
              Order now
            </Link>

            <div className="flex flex-wrap justify-end gap-x-4 gap-y-2 text-grey-100">
              <div className="flex items-center space-x-2">
                <Star size={20} className="text-grey-100" />
                <span className="text-primary">{ev.rating.toFixed(1)}</span>
                <span>({ev.reviewsCount})</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin size={20} className="text-grey-100" />
                <span className="text-primary">{ev.distanceMeters}m</span>
                <span>({ev.etaMinutes}min)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Settings size={20} className="text-grey-100" />
                <span className="text-primary">{ev.transmission}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CarFront size={20} className="text-grey-100" />
                <span className="text-primary">{ev.bodyStyle}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
