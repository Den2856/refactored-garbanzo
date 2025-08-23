import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import defaultAvatarUrl from '../assets/robot.jpeg'
import Logo from '../assets/logo.svg'
import ProfileSidebar from './ui/ProfileSidebar'

export default function Header() {
  const { isAuthenticated } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  return (
    <header className="bg-wh-100 rounded-lg max-w-screen-xl mx-auto px-4 top-3 md:px-6 lg:px-8 py-4 relative z-20">
      <div className="flex items-center justify-between">
        {/* Логотип */}
        <NavLink to="/">
          <img src={Logo} alt="EV VOLTEDGE" className="h-10" />
        </NavLink>

        {/* Десктоп-меню */}
        <nav className="hidden md:flex items-center space-x-8">
          {['Home','Products','Features',].map(l => (
            <NavLink
              key={l}
              to={l==='Home'?'/':`/${l.replace(/\s+/g,'-').toLowerCase()}`}
              className="text-primary hover:text-secondary transition"
            >
              {l}
            </NavLink>
          ))}

          {/* Кнопка Login / Аватар */}
          {isAuthenticated ? (
            <button
              onClick={() => setIsProfileOpen(open => !open)}
              className="p-1 rounded-full hover:bg-wh-50 transition"
            >
              <img
                src={defaultAvatarUrl}
                alt="User avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
            </button>
          ) : (
            <Link
              to="/login"
              className="px-6 py-2 bg-secondary rounded-lg text-wh-100 hover:brightness-90 transition"
            >
              Login
            </Link>
          )}
        </nav>

        <div className="flex items-center md:hidden space-x-2">
          {isAuthenticated ? (
            <button
              onClick={() => setIsProfileOpen(open => !open)}
              aria-label="Toggle profile menu"
              className="p-2 rounded-full hover:bg-wh-50 transition"
            >
              <img
                src={defaultAvatarUrl}
                alt="User avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
            </button>
          ) : (
            <Link
              to="/login"
              className="px-4 py-1 bg-secondary rounded-lg text-wh-100 hover:brightness-90 transition text-sm"
            >
              Login
            </Link>
          )}

          <button
            onClick={() => setIsOpen(o => !o)}
            aria-label="Toggle navigation"
            className="p-2 rounded-lg hover:bg-wh-50 transition"
          >
            {isOpen
              ? <X className="w-6 h-6 text-primary" />
              : <Menu className="w-6 h-6 text-primary" />
            }
          </button>
        </div>
      </div>

      {/* Мобильное выпадающее меню */}
      {isOpen && (
        <nav className="md:hidden bg-wh-100 mx-4 my-3 rounded-lg border border-grey-10 p-4 space-y-2">
          {['Home','Products','Features','Gear Shop'].map(l => (
            <NavLink
              key={l}
              to={l==='Home'?'/':`/${l.replace(/\s+/g,'-').toLowerCase()}`}
              className="block text-lg text-primary hover:text-secondary transition"
              onClick={() => setIsOpen(false)}
            >
              {l}
            </NavLink>
          ))}
        </nav>
      )}

      {/* Здесь вы можете рендерить профильный сайдбар */}
      {isProfileOpen && <ProfileSidebar onClose={() => setIsProfileOpen(false)} />}
    </header>
)
}
