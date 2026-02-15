import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { adminRoute } from "./server/Routes/AdminRoute.js";

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: (origin, cb) => cb(null, true),
  credentials: true
}));

// API routes first
app.use("/auth", adminRoute);

// Serve frontend build
app.use(express.static(path.join(__dirname, "server", "Public", "dist")));

// ✅ SAFE fallback (no app.get("*"))
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "server", "Public", "dist", "index.html"));
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
