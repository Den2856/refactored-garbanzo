import ReservationForm from '../home/ReservationForm'
import { X } from 'lucide-react'

interface ReservationModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ReservationModal({
  isOpen,
  onClose,
}: ReservationModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose} />

      <div className="relative bg-white rounded-lg shadow-lg max-w-3xl w-full mx-4">
        <button
          className="absolute top-2 right-4 text-gray-500 hover:text-gray-800 text-4xl leading-none"
          onClick={onClose}
          aria-label="Close"
        >
          <X/>
        </button>

        {/* Форма без картинки (showImage=false) */}
        <ReservationForm showImage={false} />
      </div>
    </div>
  )
}
