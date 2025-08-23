import { Schema, model, Document } from 'mongoose'

export interface IEV extends Document {
  name:          string
  slug:          string
  price:         number     // рент‑прайс в день
  rangeKm:       number
  images:        string[]   // массив URL‑ов изображений
  available:     boolean    // для бейджа “Available now”
  rating:        number     // средний рейтинг, 0–5
  reviewsCount:  number     // число отзывов
  distanceMeters:number     // расстояние до машины
  etaMinutes:    number     // ETA в минутах
  transmission:  'Manual' | 'Automatic'
  bodyStyle:     string     // например, 'Hatchback', 'SUV'
  yearOfRelease: number     // год выпуска
  createdAt:     Date
  updatedAt:     Date
}

const EVSchema = new Schema<IEV>(
  {
    name:           { type: String, required: true },
    slug:           { type: String, required: true, unique: true },
    price:          { type: Number, required: true },
    rangeKm:        { type: Number, required: true },
    images:         [{ type: String, required: true }],
    available:      { type: Boolean, default: false },
    rating:         { type: Number, default: 0 },
    reviewsCount:   { type: Number, default: 0 },
    distanceMeters: { type: Number, default: 0 },
    etaMinutes:     { type: Number, default: 0 },
    transmission:   { type: String, enum: ['Manual','Automatic'], default: 'Manual' },
    bodyStyle:      { type: String, default: '' },
    yearOfRelease:  { type: Number, required: true },
  },
  { timestamps: true }
)

export default model<IEV>('EV', EVSchema)
