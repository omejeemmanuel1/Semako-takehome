import mongoose, { Document, Schema } from "mongoose";

export interface MemberDocument extends Document {
  id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  pin: string;
  verify: Boolean;
  balance: number;
  accountHistory: Array<{ date: Date; description: string; amount: number }>;
  schemes: Array<{ name: string; interestRate: number; maturityDate: Date }>;
}

const memberSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  pin: { type: String, required: true, minlength: 4, maxlength: 4 },
  verify: {
    type: Boolean,
    default: "true",
  },
  balance: { type: Number, default: 0 },
  accountHistory: [
    {
      date: { type: Date, default: Date.now },
      description: { type: String, required: true },
      amount: { type: Number, required: true },
    },
  ],
  schemes: [
    {
      name: { type: String, required: true },
      interestRate: { type: Number, required: true },
      maturityDate: { type: Date, required: true },
    },
  ],
});

const Member = mongoose.model<MemberDocument>("Member", memberSchema);

export default Member;
