import { Schema, model } from 'mongoose'

interface IDelivery {
  notif: Schema.Types.ObjectId
  user:  Schema.Types.ObjectId
  deliveredAt: Date
  readAt?: Date | null
}

const schema = new Schema<IDelivery>({
  notif: { type: Schema.Types.ObjectId, ref: 'Notification', required: true, index: true },
  user:  { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  deliveredAt: { type: Date, default: Date.now },
  readAt: { type: Date, default: null }
}, { timestamps: true })

// чтобы не дублировать доставку
schema.index({ notif: 1, user: 1 }, { unique: true })

export const NotificationDelivery = model<IDelivery>('NotificationDelivery', schema)
