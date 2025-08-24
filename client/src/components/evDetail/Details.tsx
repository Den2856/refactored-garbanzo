import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import {
  Heart,
  BarChart2,
  Share2,
  ArrowRight,
  Calendar,
  CheckCircle,
} from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import StatusBadge from '../../components/ui/StatusBadge'
import Spinner from '../../components/ui/Spinner'
import ReservationModal from '../../components/evDetail/ReservationModal'
import type { EV } from '../../components/ui/EVCard'
import { toast } from '../../components/ui/NotificationToaster'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4002'
const MAX_COMPARE = 3

export default function DetailsPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { user, isAuthenticated, loading: authLoading } = useAuth()

  const [ev, setEv] = useState<EV | null>(null)
  const [mainImg, setMainImg] = useState<string>('')

  // favorites
  const [isFav, setIsFav] = useState(false)
  const [loadingFav, setLoadingFav] = useState(true)

  // compare
  const [inCompare, setInCompare] = useState(false)
  const [compareCount, setCompareCount] = useState(0)
  const [loadingCmp, setLoadingCmp] = useState(true)

  const [showTestDriveModal, setShowTestDriveModal] = useState(false)

  // 1) Load EV details
  useEffect(() => {
    if (!slug) return
    axios
      .get<EV>(`${API}/api/evs/${slug}`)
      .then((res) => {
        setEv(res.data)
        setMainImg(res.data.images[0] || '')
      })
      .catch(console.error)
  }, [slug])

  // 2) Favorites
  useEffect(() => {
    if (!ev) return
    if (authLoading) return
    if (!isAuthenticated || !user) {
      setLoadingFav(false)
      return
    }

    const evId = ev._id
    axios
      .get<EV[]>(`${API}/api/users/${user.id}/favorites`)
      .then((res) => setIsFav(res.data.some((x) => x._id === evId)))
      .catch(console.error)
      .finally(() => setLoadingFav(false))
  }, [ev, user, isAuthenticated, authLoading])

  // 3) Compare status + count
  useEffect(() => {
    if (!ev) return
    if (authLoading) return
    if (!isAuthenticated || !user) {
      setLoadingCmp(false)
      return
    }

    const evId = ev._id
    axios
      .get<EV[]>(`${API}/api/users/${user.id}/compare`)
      .then((res) => {
        const list = res.data
        setCompareCount(list.length)
        setInCompare(list.some((x) => x._id === evId))
      })
      .catch(console.error)
      .finally(() => setLoadingCmp(false))
  }, [ev, user, isAuthenticated, authLoading])

  // 4) Recently viewed (silent)
  useEffect(() => {
    if (!ev) return
    if (!isAuthenticated || !user) return
    axios.post(`${API}/api/users/${user.id}/recent`, { evId: ev._id }).catch(() => {})
  }, [ev, user, isAuthenticated])

  if (!ev) return <Spinner />

  const evId = ev._id

  // Toggle favorite
  async function handleToggleFav() {
    if (!ev) return
    if (!isAuthenticated || !user) {
      navigate('/login')
      return
    }

    try {
      if (isFav) {
        await axios.delete(`${API}/api/users/${user.id}/favorites/${evId}`)
      } else {
        await axios.post(`${API}/api/users/${user.id}/favorites/${evId}`)
      }
      setIsFav(!isFav)
    } catch (err) {
      console.error(err)
      toast({ variant: 'error', message: 'Не удалось обновить избранное' })
    }
  }

  async function handleToggleCompare() {
    if (!ev) return
    if (!isAuthenticated || !user) {
      navigate('/login')
      return
    }

    try {
      setLoadingCmp(true)

      if (inCompare) {
        await axios.delete(`${API}/api/users/${user.id}/compare/${evId}`)
        setInCompare(false)
        setCompareCount((n) => Math.max(0, n - 1))
        toast({ variant: 'info', message: 'Модель убрана из сравнения' })
      } else {
        // проверка лимита до запроса
        if (compareCount >= MAX_COMPARE) {
          toast({
            variant: 'error',
            title: 'Compare limit',
            message: `Можно сравнивать не более ${MAX_COMPARE} авто.`,
          })
          return
        }

        // добавить в сравнение
        const r = await axios.post(`${API}/api/users/${user.id}/compare`, { evId })
        if (r.status === 201 || r.status === 200) {
          setInCompare(true)
          setCompareCount((n) => n + 1)
          toast({ variant: 'success', message: 'Добавлено в сравнение' })
        }
      }
    } catch (err: any) {
      // если сервер тоже ограничивает лимит — поймаем 409
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        toast({
          variant: 'error',
          title: 'Compare limit',
          message: `Можно сравнивать не более ${MAX_COMPARE} авто.`,
        })
      } else {
        console.error(err)
        toast({ variant: 'error', message: 'Не удалось обновить сравнение' })
      }
    } finally {
      setLoadingCmp(false)
    }
  }

  // Brand → logo
  const brandKey = ev.name.split(' ')[0].toLowerCase()
  const logos: Record<string, string> = {
    tesla: 'tesla.svg',
    audi: 'audi.svg',
    'mercedes-benz': 'mercedes-benz.svg',
    bmw: 'bmw.svg',
  }
  const logoSrc = logos[brandKey] || 'default.svg'

  const disableCompareBtn = loadingCmp || (!inCompare && compareCount >= MAX_COMPARE)

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-500 flex flex-wrap gap-1">
          <Link to="/" className="hover:underline">Home</Link>
          <span>/</span>
          <Link to="/cars" className="hover:underline">Catalog</Link>
          <span>/</span>
          <Link to={`/cars/${brandKey}`} className="hover:underline capitalize">{brandKey}</Link>
          <span>/</span>
          <span className="text-gray-700">{ev.name}</span>
        </nav>

        {/* Title & Actions */}
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
          <div className="flex flex-col gap-6">
            <h1 className="text-2xl sm:text-3xl font-semibold flex items-center gap-2">
              <img src={`/evs/logos/${logoSrc}`} alt={brandKey} className="h-8 w-auto" />
              {ev.name}
            </h1>

            <div className="flex items-center space-x-3">
              {/* Favorite */}
              <button
                onClick={handleToggleFav}
                disabled={loadingFav}
                className={[
                  'p-2 rounded-full transition',
                  isFav ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                  loadingFav ? 'opacity-50 cursor-wait' : '',
                ].join(' ')}
                aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart size={18} fill={isFav ? 'currentColor' : 'none'} />
              </button>

              {/* Compare (с лимитом) */}
              <button
                onClick={handleToggleCompare}
                disabled={disableCompareBtn}
                className={[
                  'p-2 rounded-full transition',
                  inCompare ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                  disableCompareBtn ? 'opacity-60 cursor-not-allowed' : '',
                ].join(' ')}
                aria-label={inCompare ? 'Remove from compare' : 'Add to compare'}
                title={
                  inCompare
                    ? 'Remove from compare'
                    : compareCount >= MAX_COMPARE
                    ? `MAX ${MAX_COMPARE} CARS`
                    : 'Add to compare'
                }
              >
                <BarChart2 size={18} />
              </button>

              {/* Share */}
              <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
                <Share2 size={18} />
              </button>
            </div>
          </div>

          {/* Price & CTA */}
          <div className="flex flex-col sm:items-end gap-6">
            <span className="text-2xl sm:text-3xl font-bold">${ev.price.toLocaleString()}</span>
            <div className="flex space-x-4">
              <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition">
                Trade-in
              </button>
              <button onClick={() => setShowTestDriveModal(true)} className="inline-flex items-center px-4 py-2 bg-price text-white rounded-lg hover:opacity-90 transition-opacity duration-200">
                Book a car <ArrowRight size={16} className="ml-2" />
              </button>
            </div>
          </div>
        </div>

        {/* Gallery & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg space-y-4 p-4">
            <StatusBadge available={ev.available} />
            <img
              src={`/evs/${mainImg}`}
              alt={ev.name}
              className="w-full object-cover rounded-lg"
            />
            <div className="space-x-2 overflow-x-auto hidden sm:flex ">
              {ev.images.map((img, i) => (
                <img
                  key={i}
                  src={`/evs/${img}`}
                  onClick={() => setMainImg(img)}
                  className="w-fit h-16 object-cover rounded-md cursor-pointer border-2 border-transparent hover:border-blue-500"
                />
              ))}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <h2 className="font-semibold">RideZone Cars</h2>
              <p className="text-gray-700 whitespace-pre-line">{ev.description}</p>
              <div className="mt-4 space-y-2">
                <button disabled className="w-full px-3 py-2 bg-gray-100 rounded-lg text-left disabled:opacity-60">
                  Video presentation
                </button>
                <button
                  onClick={() => setShowTestDriveModal(true)}
                  className="w-full px-3 py-2 bg-gray-100 rounded-lg text-left hover:bg-gray-200 transition"
                >
                  Sign up for a test drive
                </button>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-lg flex items-center justify-between">
              <span>VIN is checked in</span>
              <CheckCircle size={24} className="text-green-500" />
            </div>
            <div className="bg-white p-4 rounded-lg shadow-lg space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <Calendar size={16} /> <span>Year of release</span> <span>{ev.yearOfRelease}</span>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {showTestDriveModal && (
        <ReservationModal isOpen onClose={() => setShowTestDriveModal(false)} />
      )}
    </div>
  )
}
