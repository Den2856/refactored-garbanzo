import { Schema, model, Types } from 'mongoose'

/** Варианты тостов — экспортируем для шаблонов/контроллеров */
export type NotificationVariant = 'success' | 'error' | 'info' | 'warning'
/** Для обратной совместимости, если где-то уже используется ToastVariant */
export type ToastVariant = NotificationVariant

/** То, что реально рендерится и уходит на клиент */
export interface IRendered {
  id?: string
  type?: string
  title?: string
  message: string
  variant?: NotificationVariant
  ttlMs?: number
  icon?: string
}

/** Подсхема для rendered */
const RenderedSchema = new Schema<IRendered>(
  {
    id: { type: String },
    type: { type: String },
    title: { type: String },
    message: { type: String, required: true },
    variant: { type: String, enum: ['success', 'error', 'info', 'warning'] },
    ttlMs: { type: Number },
    icon: { type: String },
  },
  { _id: false }
)

/** Основная схема уведомления */
const NotificationSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User', required: true },
    target: { type: String, enum: ['user', 'all'], default: 'user' },
    type: { type: String, required: true },              // служебный тип события
    data: { type: Schema.Types.Mixed, default: {} },     // произвольные данные
    rendered: { type: RenderedSchema, required: true },  // объект, не строка
    suppressed: { type: Boolean, default: false },
    deliveredAt: { type: Date },                         // если есть — pull не вернёт повторно
  },
  { timestamps: true }
)

export const Notification = model('Notification', NotificationSchema)
