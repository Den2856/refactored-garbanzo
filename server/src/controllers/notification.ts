import { Request, Response } from 'express'
import { NotificationPref } from '../models/notificationToast'
import { Notification } from '../models/notification'
import { sse, sseHeaders } from '../utils/sse'
import { render } from '../templates/notificationTemplate'
import { NotificationDelivery } from '../models/notificationDelivery'

type RenderedToast = {
  id?: string
  type?: string
  title?: string
  message: string
  variant?: 'success' | 'error' | 'info' | 'warning'
  ttlMs?: number
}



export async function getPrefs(req: Request, res: Response) {
  const userId = req.user!.id
  const doc = (await NotificationPref.findOne({ user: userId }))
    || (await NotificationPref.create({ user: userId }))
  res.json({ data: { muted: doc.muted, channels: doc.channels } })
}

export async function setPrefs(req: Request, res: Response) {
  const userId = req.user!.id
  const { muted, channels } = req.body as { muted?: boolean; channels?: { toast?: boolean; email?: boolean } }
  const doc = await NotificationPref.findOneAndUpdate(
    { user: userId },
    { $set: { ...(muted !== undefined ? { muted } : {}), ...(channels ? { channels } : {}) } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  )
  res.json({ data: { muted: doc!.muted, channels: doc!.channels } })
}

export async function stream(req: Request, res: Response) {
  const userId = req.user!.id
  res.writeHead(200, sseHeaders())
  sse.add(userId, res)

  const pref = (await NotificationPref.findOne({ user: userId }))
    || (await NotificationPref.create({ user: userId }))
  sse.send(userId, 'init', { muted: pref.muted, channels: pref.channels })

  const ping = setInterval(() => res.write(': ping\n\n'), 25000)
  req.on('close', () => { clearInterval(ping); sse.remove(userId, res) })
}

export async function emit(req: Request, res: Response) {
  const { userId, type, data } = req.body as { userId: string; type: string; data: any }
  const pref = (await NotificationPref.findOne({ user: userId }))
    || (await NotificationPref.create({ user: userId }))

  const rendered = render(type, data)
  const suppressed = !!pref.muted || pref.channels.toast === false

  const saved = await Notification.create({
    user: userId,
    type,
    data,
    rendered,
    suppressed,
    deliveredAt: suppressed ? undefined : new Date()
  })

  if (!suppressed) sse.send(userId, 'toast', rendered)
  res.status(201).json({ data: { id: saved.id, suppressed } })
}

export async function pull(req: Request, res: Response) {
  const userId = req.user!.id

  const pref = await NotificationPref.findOne({ user: userId }).lean()
  const toastEnabled = !pref?.muted && pref?.channels?.toast !== false
  if (!toastEnabled) return res.json({ data: [] })

  // 1) ЛИЧНЫЕ (target:'user'): как раньше
  const personal = await Notification.find({
    target: 'user',
    user: userId,
    suppressed: false,
    deliveredAt: { $exists: false }
  }).sort({ createdAt: 1 }).limit(50).lean()

  if (personal.length) {
    const ids = personal.map(n => n._id)
    await Notification.updateMany({ _id: { $in: ids } }, { $set: { deliveredAt: new Date() } })
  }

  // 2) ОБЩИЕ (target:'all'): берём все, отфильтровываем уже доставленные этому юзеру
  const globals = await Notification.find({
    target: 'all',
    suppressed: false
  }).sort({ createdAt: 1 }).limit(50).lean()

  let globalsToDeliver = globals
  if (globals.length) {
    const delivered = await NotificationDelivery.find({
      user: userId,
      notif: { $in: globals.map(g => g._id) }
    }).select('notif').lean()
    const deliveredSet = new Set(delivered.map(d => String(d.notif)))
    globalsToDeliver = globals.filter(g => !deliveredSet.has(String(g._id)))

    if (globalsToDeliver.length) {
      // фиксируем доставку этому юзеру
      await NotificationDelivery.insertMany(
        globalsToDeliver.map(g => ({ notif: g._id, user: userId, deliveredAt: new Date() })),
        { ordered: false }
      )
    }
  }

  // объединяем
  const payload = [
    ...personal.map(n => n.rendered),
    ...globalsToDeliver.map(n => n.rendered)
  ]

  res.json({ data: payload })
}

export async function push(req: Request, res: Response) {
  const userId = req.user?.id
  if (!userId) return res.status(401).json({ message: 'unauthorized' })

  const body = (req.body || {}) as {
    rendered?: Partial<RenderedToast>
    title?: string
    message?: string
    variant?: RenderedToast['variant']
    ttlMs?: number
    type?: string
    data?: any
    id?: string
  }

  let finalRendered: RenderedToast | undefined

  if (body.rendered && typeof body.rendered.message === 'string') {
    const { id, type, title, message, variant, ttlMs } = body.rendered
    finalRendered = { id, type, title, message, variant, ttlMs }
  } else if (typeof body.message === 'string') {
    finalRendered = {
      id: body.id || `toast_${Date.now()}`,
      type: body.type || 'Custom',
      title: body.title,
      message: body.message,
      variant: body.variant,
      ttlMs: body.ttlMs,
    }
  } else if (body.type) {
    const r = render(body.type, body.data ?? {})
    if (r && typeof (r as any).message === 'string') {
      finalRendered = r as RenderedToast
    }
  }

  if (!finalRendered) {
    return res.status(400).json({
      message:
        'Bad request: provide either {rendered}, or {title,message[,...]}, or {type,data}.',
    })
  }

  // учёт предпочтений (mute)
  const pref =
    (await NotificationPref.findOne({ user: userId })) ||
    (await NotificationPref.create({ user: userId }))
  const suppressed = !!pref.muted || pref.channels.toast === false

  // ВАЖНО: НЕ ставим deliveredAt — пусть его поставит /pull при выдаче
  const saved = await Notification.create({
    user: userId,
    target: 'user',
    type: finalRendered.type || body.type || 'Custom',
    data: body.data ?? {},
    rendered: finalRendered,
    suppressed,
    // deliveredAt: undefined
  })

  // SSE можно отправлять, если используешь стрим; если оставишь — получишь дубль вместе с pull
  // if (!suppressed) sse.send(userId, 'toast', finalRendered)

  return res.status(201).json({ data: { id: saved.id, suppressed } })
}
