import { useState, type ChangeEvent, type FormEvent } from 'react'

type FormState = {
  firstName: string
  lastName:  string
  email:     string
  message:   string
}

type Status = 'idle' | 'sending' | 'success' | 'error'

interface ReservationFormProps {
  showImage: boolean
}

export default function ReservationForm({ showImage }: ReservationFormProps) {
  const [form, setForm] = useState<FormState>({
    firstName: '',
    lastName:  '',
    email:     '',
    message:   '',
  })
  const [status, setStatus] = useState<Status>('idle')

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:4001'}/api/send-email`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        }
      )
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div
      className={`
        container
        mx-auto
        px-4 py-8
        flex flex-col
        ${showImage ? 'md:flex-row items-center gap-8' : ''}
      `}
    >
      <form
        onSubmit={handleSubmit}
        className={`
          bg-white p-6 rounded-lg shadow-md
          w-full
          ${showImage ? 'md:w-1/2' : ''}
        `}
      >
        <h2 className="text-2xl font-semibold mb-6">Reserve Your EV Today!</h2>
        <div className="flex flex-col sm:flex-row sm:space-x-4 mb-4">
          <input
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            required
            className="w-full sm:w-1/2 bg-gray-100 border border-gray-300 rounded px-3 py-2 mb-4 sm:mb-0 focus:outline-none focus:ring-2 focus:ring-secondary"
          />
          <input
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            required
            className="w-full sm:w-1/2 bg-gray-100 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>
        <div className="mb-4">
          <input
            type="email"
            name="email"
            placeholder="Email ID"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>
        <div className="mb-6">
          <textarea
            name="message"
            placeholder="Message"
            value={form.message}
            onChange={handleChange}
            required
            className="w-full h-28 bg-gray-100 border border-gray-300 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>
        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full bg-primary text-wh-100 py-3 rounded hover:bg-gray-900 transition"
        >
          {status === 'sending' ? 'Sending…' : 'Book Now'}
        </button>
        {status === 'success' && <p className="mt-4 text-green-600">Sent successfully!</p>}
        {status === 'error'   && <p className="mt-4 text-red-600">Error sending message.</p>}
      </form>

      {showImage && (
        <div className="w-full md:w-1/2 h-full flex items-center justify-center">
          <img
            src="/ev-car.png"
            alt="EV Car"
            className="rounded-lg w-full object-contain"
          />
        </div>
      )}
    </div>
  )
}
