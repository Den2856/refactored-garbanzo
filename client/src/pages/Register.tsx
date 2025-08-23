import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import GoogleIcon from '../assets/google.svg'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        form,
        { headers: { 'Content-Type': 'application/json' } }
      )
      navigate('/login')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Что-то пошло не так')
    }
  }

  return (
    <div
      className="
        min-h-screen w-full flex items-center justify-center
        bg-[url('src/assets/bg.svg')] bg-no-repeat bg-cover bg-center
        px-4 sm:px-6 md:px-8 lg:px-10 xl:px-24
      "
    >
      <form
        onSubmit={handleSubmit}
        className="
          w-full
          max-w-[90vw] sm:max-w-[540px]
          h-auto sm:h-[600px]
          bg-form-bg
          px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24
          py-8 sm:py-[50px]
          rounded-[20px] shadow
        "
      >
        <h2 className="text-xl sm:text-[28px] text-foreground-h font-bold mb-8">
          Create an account
        </h2>

        {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}

        <label className="block mb-4">
          <span className="text-sm sm:text-base text-foreground-d font-medium">
            Name
          </span>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="
              mt-3 block w-full border text-foreground-d
              border-outline-default bg-form-bg rounded
              px-3 py-2 focus:outline-none focus:ring
            "
            placeholder="Иван Иванов"
          />
        </label>

        <label className="block mb-4">
          <span className="text-sm sm:text-base text-foreground-d font-medium">
            Email
          </span>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className="
              mt-3 block w-full border text-foreground-d
              border-outline-default bg-form-bg rounded
              px-3 py-2 focus:outline-none focus:ring
            "
            placeholder="you@example.com"
          />
        </label>

        <label className="block mb-8">
          <span className="text-sm sm:text-base text-foreground-d font-medium">
            Password
          </span>
          <div className="relative mt-3">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="
                block w-full border text-foreground-d
                border-outline-default bg-form-bg rounded
                px-3 py-2 pr-10 focus:outline-none focus:ring
              "
              placeholder="Enter your password"
            />

            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-d hover:text-white transition"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </label>

        <button
          type="submit"
          className="w-full py-2 bg-button-primary text-foreground-b rounded-lg transition"
        >
          Register
        </button>

        <button
          className="mt-6 w-full py-2 bg-button-default text-foreground-p rounded-lg transition"
          disabled
        >
          <div className="flex justify-center">
            <img src={GoogleIcon} alt="google" className="mr-1" />
            <span>Continue with Google</span>
          </div>
        </button>

        <p className="mt-4 text-center text-sm text-foreground-l">
          Already have an account?{' '}
          <Link to="/login" className="text-foreground-p hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  )
}