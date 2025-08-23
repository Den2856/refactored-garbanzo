import { Schema, model, Document, Types } from 'mongoose'
import bcrypt from 'bcrypt'

export interface IUser extends Document {
  email:      string
  password:   string
  name?:      string
  role: 'user' | 'admin'
  favorites:  Types.ObjectId[]    // <— array of EV._id
  createdAt:  Date
  updatedAt:  Date
  comparePassword(candidate: string): Promise<boolean>
}


const SavedSearchSchema = new Schema(
  { name: String, query: String, href: String, updatedAt: { type: Date, default: Date.now } },
  { _id: true }
);

const PriceAlertSchema = new Schema(
  { ev: { type: Types.ObjectId, ref: "EV", required: true }, target: { type: Number, required: true }, currency: { type: String, default: "$" }, active: { type: Boolean, default: true } },
  { timestamps: true }
);

const RecentSchema = new Schema(
  { ev: { type: Types.ObjectId, ref: "EV", required: true }, at: { type: Date, default: Date.now } },
  { _id: true }
);

const userSchema = new Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    favorites: [{ type: Types.ObjectId, ref: "EV" }],
    savedSearches: { type: [SavedSearchSchema], default: [] },
    alerts: { type: [PriceAlertSchema], default: [] },
    compare: { type: [Types.ObjectId], ref: "EV", default: [] },
    recent: { type: [RecentSchema], default: [] }
  },
  { timestamps: true }
);


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
(userSchema as any).methods.comparePassword = function (candidate: string) { return bcrypt.compare(candidate, this.password); };

export default model("User", userSchema);
