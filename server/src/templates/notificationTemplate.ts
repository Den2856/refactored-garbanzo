import { IRendered, NotificationVariant } from '../models/notification'

/** компактный генератор уникального id без зависимостей */
function uid() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`
}

type TemplateFn = (input: any) => Omit<IRendered, 'id' | 'type'>
const v = (x: NotificationVariant) => x

/** Набор готовых шаблонов под именем типа */
export const templates: Record<string, TemplateFn> = {
  reservation_success: ({ reservationId, when, station }: any) => ({
    title: 'Бронирование подтверждено',
    message: `ID: ${reservationId} · ${when} · ${station}`,
    variant: v('success'),
    icon: 'check-circle',
    ttlMs: 7000,
  }),

  charger_error: ({ reason }: any) => ({
    title: 'Ошибка зарядки',
    message: reason || 'Неизвестная ошибка',
    variant: v('error'),
    icon: 'alert-triangle',
    ttlMs: 9000,
  }),

  info: ({ message }: any) => ({
    title: 'Информация',
    message,
    variant: v('info'),
    icon: 'info',
    ttlMs: 6000,
  }),

  promo: ({ text }: any) => ({
    title: 'Акция',
    message: text,
    variant: v('warning'),
    icon: 'star',
    ttlMs: 8000,
  }),

  /** опционально — шаблон для твоего типа авторизации */
  auth_login: ({ email }: any) => ({
    title: 'Вход выполнен',
    message: `${email ? `: ${email}` : ''}`,
    variant: v('success'),
    ttlMs: 8000,
  }),
}

/** Срендерить уведомление по имени шаблона + данным */
export function render(type: string, data: any): IRendered {
  const fn = templates[type]
  if (!fn) {
    // дефолтный «прозрачный» рендер: превращаем данные в текст
    return {
      id: uid(),
      type,
      title: 'Уведомление',
      message: typeof data === 'string' ? data : JSON.stringify(data),
      variant: 'info',
      ttlMs: 6000,
    }
  }
  const base = fn(data)
  return { id: uid(), type, ...base }
}
