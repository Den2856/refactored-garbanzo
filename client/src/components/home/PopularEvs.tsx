import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import EVCard, { type EV } from '../ui/EVCard'
import Spinner from '../ui/Spinner'
import SectionTitle from '../ui/SectionTitle'
import { ArrowRight } from 'lucide-react'

export default function PopularEvs() {
  const [evs, setEvs] = useState<EV[]>([])
  const [loading, setLoading] = useState(true)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/evs/popular`)
      .then(r => r.json())
      .then((data: EV[]) => {
        setEvs(data)
        setLoading(false)
        setTimeout(() => setAnimate(true), 50)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />
  if (!evs.length) return <p className="text-center py-8">No popular EVs found.</p>

  return (
    <section className="max-w-[161.5rem] mx-auto px-4 py-8">
      {/* Заголовок по центру + “See More” справа */}
      <div className="relative mb-6">
        {/* Центрируем заголовок */}
        <div className="text-center">
          <SectionTitle title="Popular Rentals" />
        </div>
        {/* Кнопка справа */}
        <div className="flex justify-end">
          <Link
            to="/cars"
            className="
              inline-flex items-center
              px-6 py-3
              bg-price hover:opacity-90
              text-white text-base font-medium
              rounded-lg shadow
              transition-colors duration-200
            "
          >
            See More
            <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {evs.map((ev, idx) => (
          <EVCard key={ev._id} ev={ev} idx={idx} animate={animate} />
        ))}
      </div>
    </section>
  )
}
