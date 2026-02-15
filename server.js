import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { adminRoute } from "./server/Routes/AdminRoute.js";

const app = express();
const port = process.env.PORT || 3000;

/* Fix __dirname for ES modules */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* Middleware */
app.use(express.json());
app.use(cookieParser());

/* CORS
   - Localhost allowed for development
   - Same-origin allowed in production (Elastic Beanstalk)
*/
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175"
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // allow EB domain
      }
    },
    credentials: true
  })
);

/* API Routes */
app.use("/auth", adminRoute);

/* Serve Vite React build */
app.use(express.static(path.join(__dirname, "server", "Public", "dist")));

app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "server", "Public", "dist", "index.html")
  );
});


/* Start server */
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
