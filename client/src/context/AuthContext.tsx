import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import axios from 'axios'
import { toast } from '../components/ui/NotificationToaster'

// ---- типы
interface User {
  id: string
  email: string
  name?: string
  createdAt?: string
}

interface AuthCtx {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  // сюда прилетает уже полученный на бэке jwt-токен
  login: (token: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthCtx | undefined>(undefined)

// ---- отправить на сервер уведомление о факте авторизации (ТОКЕН ПЕРЕДАЁМ ЯВНО)
async function pushAuthToast(token: string, email?: string) {
  try {
    await axios.post(
      '/api/notifications/push',
      {
        title: 'Вход выполнен',
        message: email ?? ``,
        variant: 'success',
        ttlMs: 8000,
        type: 'auth_login',
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )
  } catch (err) {
    console.warn('[push] failed', err)
  }
}

// ---- показать тосты, которые сервер сложил в БД (ТОКЕН ПЕРЕДАЁМ ЯВНО)
async function showServerToasts(token: string) {
  try {
    const { data } = await axios.get<{
      data: Array<{
        id: string
        title?: string
        message: string
        variant?: 'success' | 'error' | 'info' | 'warning'
        ttlMs?: number
      }>
    }>('/api/notifications/pull', {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!data?.data?.length) return

    for (const t of data.data) {
      toast({
        id: t.id,
        title: t.title,
        message: t.message,
        variant: t.variant ?? 'info',
        ttl: t.ttlMs ?? 6000,
      })
    }
  } catch (err) {
    console.warn('[pull] failed', err)
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // базовая настройка axios
  axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4001'
  axios.defaults.withCredentials = true

  // === ГАРД ОТ StrictMode: эффект выполнится ровно один раз
  const didInit = useRef(false)

  // начальная загрузка: подтянуть token из localStorage, профиль и показать невручённые тосты
  useEffect(() => {
    if (didInit.current) return
    didInit.current = true

    const t = localStorage.getItem('token')
    setToken(t || null)

    if (!t) {
      setLoading(false)
      return
    }

    axios
      .get<{ _id: string; email: string; name?: string; createdAt: string }>(
        '/api/auth/me',
        { headers: { Authorization: `Bearer ${t}` } }
      )
      .then(async (res) => {
        setUser({
          id: res.data._id,
          email: res.data.email,
          name: res.data.name,
          createdAt: res.data.createdAt,
        })
        // ВАЖНО: тут НЕ вызываем pushAuthToast — это не новый логин.
        await showServerToasts(t)
      })
      .catch(() => {
        localStorage.removeItem('token')
      })
      .finally(() => setLoading(false))
  }, [])

    useEffect(() => {
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        delete axios.defaults.headers.common['Authorization'];
      }
    }, [token]);


  // логин: сохранить токен, подтянуть профиль, отправить тост о входе (один раз в сессию) и показать тосты
  async function login(t: string) {
    localStorage.setItem('token', t)
    setToken(t)

    const res = await axios.get<{
      _id: string
      email: string
      name?: string
      createdAt: string
    }>('/api/auth/me', { headers: { Authorization: `Bearer ${t}` } })

    setUser({
      id: res.data._id,
      email: res.data.email,
      name: res.data.name,
      createdAt: res.data.createdAt,
    })

    // предохранитель: не спамить одним и тем же тостом в этой сессии вкладки
    const announcedKey = 'auth:announced'
    if (!sessionStorage.getItem(announcedKey)) {
      await pushAuthToast(t, res.data.email)
      sessionStorage.setItem(announcedKey, '1')
    }

    await showServerToasts(t)
  }

  function logout() {
    localStorage.removeItem('token')
    sessionStorage.removeItem('auth:announced')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user),
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}



export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
