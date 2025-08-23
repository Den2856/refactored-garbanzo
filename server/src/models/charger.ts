import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICharger extends Document {
  title: string;
  description: string;
  imageUrl: string;
  oldPrice: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

const ChargerSchema: Schema<ICharger> = new Schema(
  {
    title:       { type: String, required: true },
    description: { type: String, required: true },
    imageUrl:    { type: String, required: true },
    oldPrice:    { type: Number, required: true },
    price:       { type: Number, required: true },
  },
  { timestamps: true }
);

export const Charger: Model<ICharger> =
  mongoose.models.Charger as Model<ICharger> ||
  mongoose.model<ICharger>('Charger', ChargerSchema);
