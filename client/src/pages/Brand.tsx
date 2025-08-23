// Brand.tsx
import { useParams, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import BrandHero from "../components/brand/BrandHero";
import BrandGallery from "../components/brand/BrandGallery";
import ModelGrid from "../components/brand/ModelGrid";
import { BRANDS } from "../components/brand/brandConfig";
import type { EV } from "../components/ui/EVCard";
import BrandBanner from "../components/brand/BrandBanner";
import BrandBenefits from "../components/brand/BrandBenefits";
import BrandStats from "../components/brand/BrandStats";
import BrandFAQ from "../components/brand/BrandsFaq";
import Header from "../components/Header";

export default function BrandPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const brand = BRANDS[slug];
  const [evs, setEvs] = useState<EV[]>([]);

  useEffect(() => {
    fetch("/api/evs")
      .then((r) => r.json())
      .then(setEvs)
      .catch(console.error);
  }, [slug]);

  if (!brand) return <Navigate to="/404" replace />;

  return (
    <main className="space-y-6">
      <Header />
      <BrandHero {...brand.hero} />
      {brand.gallery && <BrandGallery {...brand.gallery} />}
      

      <ModelGrid items={evs} brandKey={brand.name ?? slug}/>
      {brand.banner && <BrandBanner {...brand.banner} />} 
      {brand.benefits && <BrandBenefits {...brand.benefits} />}
      {brand.stats && <BrandStats {...brand.stats} />}
      {brand.faq && <BrandFAQ {...brand.faq} />}
    </main>
  );
}
