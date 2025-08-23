// src/ui/ProfileSidebar.tsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { User as UserIcon, Bell, LogOut, ChevronRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import defaultAvatarUrl from '../../assets/robot.jpeg'

export default function ProfileSidebar({ onClose }: { onClose: () => void }) {
  const { user, token, logout } = useAuth()        // ← хук только внутри компонента
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [muted, setMuted] = useState(false)

  // удобный хелпер для заголовков
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : undefined

  // 1) тянем текущее состояние
  useEffect(() => {
    let cancelled = false
    setLoading(true)

    fetch('/api/notifications/prefs', {
      headers: authHeaders,
      credentials: authHeaders ? 'omit' : 'include',
    })
      .then(r => (r.ok ? r.json() : Promise.reject(r)))
      .then(({ data }) => { if (!cancelled) setMuted(!!data?.muted) })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [token]) // ← если токен появился/сменился — перетянуть prefs

  // 2) переключаем muted
  async function toggleMuted() {
    if (saving) return
    const next = !muted
    setSaving(true)
    try {
      const r = await fetch('/api/notifications/prefs', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        credentials: authHeaders ? 'omit' : 'include',
        body: JSON.stringify({ muted: next }),
      })
      if (!r.ok) throw new Error('Failed to update prefs')
      setMuted(next)
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  const notifLabel = loading ? '...' : muted ? 'Allow' : 'Mute'

  return (
    <div className="absolute top-full right-4 mt-2 w-64 bg-white rounded-lg shadow-lg overflow-hidden z-30">
      {/* Header */}
      <div className="p-4 flex items-center space-x-3 border-b border-gray-200">
        <img src={defaultAvatarUrl} alt="Avatar" className="w-12 h-12 rounded-full object-cover" />
        <div>
          <p className="font-medium text-gray-800">{user?.name || 'Your name'}</p>
          <p className="text-sm text-gray-500">{user?.email || 'youremail@example.com'}</p>
        </div>
      </div>

      <ul className="divide-y divide-gray-100">
        <li>
          <Link to="/profile" onClick={onClose} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition">
            <div className="flex items-center space-x-2">
              <UserIcon size={20} className="text-gray-600" />
              <span className="text-gray-700">My Profile</span>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </Link>
        </li>

        <li className="relative">
          <button
            onClick={toggleMuted}
            disabled={loading || saving}
            className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-50 transition disabled:opacity-60"
          >
            <div className="flex items-center space-x-2">
              <Bell size={20} className="text-gray-600" />
              <span className="text-gray-700">Notification</span>
            </div>
            <span className="text-sm font-medium text-gray-500">
              {notifLabel}
            </span>
          </button>
        </li>

        <li>
          <button
            onClick={() => { logout(); onClose() }}
            className="flex items-center space-x-2 w-full px-4 py-3 text-left hover:bg-gray-50 transition"
          >
            <LogOut size={20} className="text-gray-600" />
            <span className="text-gray-700">Log Out</span>
          </button>
        </li>
      </ul>
    </div>
  )
}
