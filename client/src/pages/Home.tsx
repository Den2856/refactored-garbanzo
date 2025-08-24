import Header from "../components/Header"
import Hero from "../components/home/Hero"
import ChargersSection from "../components/home/ChargersSection"
import BrowseByBrand from '../components/home/BrowseByBrand'
import ReservationForm from "../components/home/ReservationForm"
import PopularEvs from "../components/home/PopularEvs"

const ASSET_PATH = '/evs/logos'

const brands = [
  { name: 'Tesla',  logo: `${ASSET_PATH}/tesla.svg`,  href: '/cars/tesla' },
  { name: 'Audi', logo: `${ASSET_PATH}/audi.svg`, href: '/cars/audi' },
  { name: 'Mercedes-benz', logo: `${ASSET_PATH}/mercedes-benz.svg`, href: '/cars/mercedes-benz' },
  { name: 'BMW', logo: `${ASSET_PATH}/bmw.svg`, href: '/cars/bmw' },
]

export default function Home() {


  return (
    <div className="relative">
      <Hero />
      <ChargersSection />
      <PopularEvs />
      <BrowseByBrand
        brands={brands}
      />
      <ReservationForm showImage={true} />
      <div className="absolute inset-x-0 top-[32px] z-10">
        <Header />
      </div>
    </div>
  )
}
