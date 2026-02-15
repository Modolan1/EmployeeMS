import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { adminRoute } from "./server/Routes/AdminRoute.js";

const app = express();
const port = process.env.PORT || 3000;

// __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cookieParser());

// CORS (dev + production)
app.use(
  cors({
    origin: (origin, cb) => {
      const allowed = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
      ];
      if (!origin || allowed.includes(origin)) return cb(null, true);
      return cb(null, true); // allow EB domain
    },
    credentials: true,
  })
);

// API routes first
app.use("/auth", adminRoute);

// Frontend build path (use LOWERCASE public)
const frontendDir = path.join(__dirname, "server", "Public", "dist");
const indexHtml = path.join(frontendDir, "index.html");

// Serve frontend only if it exists (prevents 502 crashes)
if (fs.existsSync(indexHtml)) {
  app.use(express.static(frontendDir));

  // React Router fallback
  app.get("*", (req, res) => {
    res.sendFile(indexHtml);
  });
} else {
  // Helpful fallback so you see what's wrong instead of 502
  app.get("/", (req, res) => {
    res
      .status(200)
      .send("Backend is running, but frontend build not found. Build & deploy dist.");
  });
}

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
