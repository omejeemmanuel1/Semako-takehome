import mongoose, { Document, Schema } from "mongoose";

export interface SchemeDocument extends Document {
  name: string;
  interestRate: number;
  maturityDate: Date;
}

const schemeSchema = new Schema({
  name: { type: String, required: true },
  interestRate: { type: Number, required: true },
  maturityDate: { type: Date, required: true },
});

const Scheme = mongoose.model<SchemeDocument>("Scheme", schemeSchema);

export default Scheme;
