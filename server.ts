import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Import API routes
import authRoutes from "./server/routes/auth";
import labRoutes from "./server/routes/labs";
import testRoutes from "./server/routes/tests";
import bookingRoutes from "./server/routes/bookings";
import aiRoutes from "./server/routes/ai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());

  // Connect to MongoDB
  const MONGODB_URI = process.env.MONGODB_URI;
  if (MONGODB_URI) {
    mongoose.connect(MONGODB_URI)
      .then(() => console.log("Connected to MongoDB"))
      .catch(err => console.error("MongoDB connection error:", err));
  } else {
    console.warn("No MONGODB_URI provided. Database operations will fail.");
  }

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Shree Diagnostics API is running" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/labs", labRoutes);
  app.use("/api/tests", testRoutes);
  app.use("/api/bookings", bookingRoutes);
  app.use("/api/ai", aiRoutes);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
