import { Link } from "react-router-dom";
import SectionTitle from "../ui/SectionTitle";

// Types
type Brand = { name: string; logo: string; href?: string }

type Props = {
  title?: string
  brands: Brand[]
  className?: string
}

export default function BrowseByBrand({brands, className = '', }: Props) {
  return (
    <section className={`w-full py-5 ${className}`}>
      <div className="mx-auto max-w-[100rem] px-4 sm:px-6 lg:px-10">
        <SectionTitle title="Browse By Brand" />

        <div className="mt-6 grid gap-5 sm:gap-6 md:gap-8 [grid-template-columns:repeat(auto-fit,minmax(9rem,1fr))] md:[grid-template-columns:repeat(auto-fit,minmax(10rem,1fr))]">
          {brands.map((b) => (
            <BrandCard key={b.name} brand={b} />
          ))}
        </div>
      </div>
    </section>
  )
}

function BrandCard({ brand }: { brand: Brand }) {
  const body = (
    <div className="group focus:outline-none">
      <div
        className="
          mx-auto size-28 md:size-32 lg:size-36 rounded-full
          grid place-items-center transition
          bg-grey-10 border border-grey-10
          hover:border-primary focus:ring-2 focus:ring-primary ring-offset-2 ring-offset-wh
          shadow-sm hover:shadow-md
        "
      >
        <img
          src={brand.logo}
          alt={brand.name}
          className="max-w-[70%] h-auto object-contain"
          loading="lazy"
          decoding="async"
          sizes="(min-width:1024px) 144px, (min-width:768px) 128px, 112px"
        />
      </div>
      <p className="mt-3 text-center text-3xl sm:text-2xl text-primary">
        {brand.name}
      </p>
    </div>
  )

  return brand.href ? (
    <Link to={brand.href} aria-label={brand.name} className="block">
      {body}
    </Link>
  ) : (
    <div aria-label={brand.name}>{body}</div>
  )
}
