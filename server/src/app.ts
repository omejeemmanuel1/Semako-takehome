import express from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import db from "./configs/config";
import memberRoutes from "./routes/Members";
import schemeRoutes from "./routes/SchemeRoutes";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

db()
  .then(() => {})
  .catch((err) => {
    console.log("Error connecting to database:", err.message);
  });

app.use(express.json());
app.use(cookieParser());
app.use(logger("dev"));

app.use("/member", memberRoutes);
app.use("/scheme", schemeRoutes);

const port = 8999;

app.listen(port, () => {
  console.log(`Server started on port http://localhost:${port}`);
});
