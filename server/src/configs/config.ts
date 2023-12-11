import mongoose, { ConnectOptions } from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://takehome:Emmanuel@takehome.filiqb1.mongodb.net/?retryWrites=true&w=majority";
const db = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI, {});
    console.log("MongoDB connected Successfully");
  } catch (err) {
    console.error(`MongoDB connection error: ${err}`);
    process.exit(1);
  }
};
export default db;
