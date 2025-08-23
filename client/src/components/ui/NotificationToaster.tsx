import { useEffect, useMemo, useRef, useState } from 'react'

type Variant = 'success' | 'error' | 'info' | 'warning'
export type ToastInput = { id?: string; title?: string; message: string; variant?: Variant; ttl?: number }

type ToastItem = Required<Omit<ToastInput, 'ttl' | 'id'>> & { id: string; ttl: number; createdAt: number }

const STYLES: Record<Variant, { wrap: string; bar: string; icon: string }> = {
  success: { wrap: 'border-emerald-300 bg-emerald-50', bar: 'bg-emerald-500', icon: '✅' },
  error:   { wrap: 'border-rose-300 bg-rose-50',       bar: 'bg-rose-500',    icon: '⛔' },
  info:    { wrap: 'border-sky-300 bg-sky-50',         bar: 'bg-sky-500',     icon: 'ℹ️' },
  warning: { wrap: 'border-amber-300 bg-amber-50',     bar: 'bg-amber-500',   icon: '⚠️' },
}

export function toast(input: ToastInput) {
  const detail: ToastInput = {
    id: input.id ?? crypto.randomUUID(),
    title: input.title,
    message: input.message,
    variant: input.variant ?? 'info',
    ttl: input.ttl ?? 6000,
  }
  window.dispatchEvent(new CustomEvent('toast', { detail }))
}

export default function NotificationToaster() {
  const [items, setItems] = useState<ToastItem[]>([])
  const timers = useRef<Record<string, number>>({})

  useEffect(() => {
    function onToast(e: Event) {
      const d = (e as CustomEvent<ToastInput>).detail
      if (!d?.message) return
      const id = d.id ?? crypto.randomUUID()
      const variant: Variant = (d.variant as Variant) ?? 'info'
      const ttl = typeof d.ttl === 'number' ? d.ttl : 6000
      const item: ToastItem = { id, title: d.title ?? '', message: d.message, variant, ttl, createdAt: Date.now() }
      setItems((prev) => [item, ...prev].slice(0, 8))
      // @ts-ignore
      timers.current[id] = window.setTimeout(() => remove(id), ttl)
    }
    window.addEventListener('toast', onToast as EventListener)
    return () => {
      window.removeEventListener('toast', onToast as EventListener)
      Object.values(timers.current).forEach((t) => clearTimeout(t))
      timers.current = {}
    }
  }, [])

  const remove = (id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id))
    const t = timers.current[id]; if (t) clearTimeout(t); delete timers.current[id]
  }

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[1000] flex w-[min(100vw,22rem)] flex-col gap-2 sm:right-6 sm:top-6">
      {items.map((t) => <ToastCard key={t.id} item={t} onClose={() => remove(t.id)} />)}
    </div>
  )
}

function ToastCard({ item, onClose }: { item: ToastItem; onClose: () => void }) {
  const styles = STYLES[item.variant]
  const life = useMemo(() => Math.max(1, item.ttl), [item.ttl])
  return (
    <div className={['pointer-events-auto overflow-hidden rounded-lg border shadow-md transition-all',
      'backdrop-blur supports-[backdrop-filter]:bg-white/70', styles.wrap].join(' ')}>
      <div className="flex items-start gap-3 px-4 py-3">
        <div className="text-lg leading-none">{styles.icon}</div>
        <div className="min-w-0 flex-1">
          {item.title ? <div className="truncate text-sm font-semibold text-gray-900">{item.title}</div> : null}
          <div className="truncate text-sm text-gray-800">{item.message}</div>
        </div>
        <button onClick={onClose} className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded hover:bg-black/5" aria-label="Close">✕</button>
      </div>
      <LifeLine ttl={life} barClass={styles.bar} startedAt={item.createdAt} />
    </div>
  )
}
function LifeLine({ ttl, barClass, startedAt }: { ttl: number; barClass: string; startedAt: number }) {
  const [w, setW] = useState(100)
  useEffect(() => {
    const id = window.setInterval(() => {
      const left = Math.max(0, ttl - (Date.now() - startedAt))
      setW((left / ttl) * 100)
    }, 50)
    return () => clearInterval(id)
  }, [ttl, startedAt])
  return <div className="h-1 w-full bg-black/5"><div className={`h-full ${barClass}`} style={{ width: `${w}%`, transition: 'width 50ms linear' }} /></div>
}


export async function pullToasts(getToken?: () => string | null) {
  const token = getToken?.() || null
  const r = await fetch('/api/notifications/pull', {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  })
  if (!r.ok) return
  const { data } = await r.json() as { data: Array<{ id: string; title?: string; message: string; variant?: any; ttlMs?: number }> }
  for (const t of data) {
    window.dispatchEvent(new CustomEvent('toast', {
      detail: { id: t.id, title: t.title, message: t.message, variant: t.variant || 'info', ttl: t.ttlMs ?? 6000 }
    }))
  }
}
