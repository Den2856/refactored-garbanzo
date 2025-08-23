import { Schema, model } from 'mongoose'

interface INotificationPref {
  user: Schema.Types.ObjectId
  muted: boolean
  channels: { toast: boolean; email: boolean }
}

const schema = new Schema<INotificationPref>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', unique: true, index: true, required: true },
    muted: { type: Boolean, default: false },
    channels: {
      toast: { type: Boolean, default: true },
      email: { type: Boolean, default: false }
    }
  },
  { timestamps: true }
)

export const NotificationPref = model<INotificationPref>('NotificationPref', schema)
