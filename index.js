import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { connectDB } from "./utils/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import taskRoutes from "./routes/task.route.js";
import reportRoutes from "./routes/report.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(
  cors({
    origin: ["http://localhost:5173","https://task-management-system-frontend-afridi.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(morgan("dev"));


connectDB();

//  Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/reports", reportRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({ 
    message: "Task Management API with Cloudinary is running!",
    cloudinary: " Enabled"
  });
});

// Error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  
  console.error(" Error:", message);
  
  res.status(statusCode).json({
    message,
    success: false,
  });
});

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});