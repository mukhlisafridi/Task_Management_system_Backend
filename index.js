import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { connectDB } from "./utils/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(morgan("dev"));
connectDB();

import userRoute from "./routes/auth.route.js";
app.use("/user", userRoute);
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "internal server error";
  res.status(statusCode).json({
    message,
    success: false,
  });
});
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(` app listening on port ${PORT}`);
});
