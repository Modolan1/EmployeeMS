import 'dotenv/config';
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { adminRoute } from "./server/Routes/AdminRoute.js";
import { EmployeeRouter } from "./server/Routes/EmplohyeeRoute.js";
import jwt from "jsonwebtoken";


const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(cors({
  origin: ["http://localhost:5173"],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}))
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve images folder
app.use('/Images', express.static(path.join(__dirname, 'server', 'Public', 'Images')));

app.use(cors({
  origin: (origin, cb) => cb(null, true),
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// API routes first
app.use("/auth", adminRoute);
app.use("/employee", EmployeeRouter);

// Middleware to verify JWT token
// const verifyUser = (req, res, next) => {
//   console.log('🔍 Verifying token...');
//   const token = req.cookies.token;
  
//   if(!token) {
//     console.log(' No token found');
//     return res.json({Status: false, Error: "Not authenticated"});
//   }
  
//   jwt.verify(token, "jwt_secret_key_Excel", (err, decoded) => {
//     if(err) {
//       console.error(' Token verification error:', err.message);
//       return res.json({Status: false, Error: "Invalid token"});
//     }
    
//     console.log(' Token verified, role:', decoded.role);
//     req.id = decoded.id;
//     req.role = decoded.role;
//     next();
//   });
// };

// // Verify endpoint used by frontend - MUST be before frontend fallback
// app.get('/verify', verifyUser, (req, res) => {
//   console.log(' User verified, returning:', { role: req.role, id: req.id });
//   return res.json({Status: true, role: req.role, id: req.id});
// });

// Serve frontend build
app.use(express.static(path.join(__dirname, "server", "Public", "dist")));

//  SAFE fallback (no app.get("*"))
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "server", "Public", "dist", "index.html"));
});

app.listen(port, "0.0.0.0", () => {
  console.log(` Server running on port ${port}`);
  console.log(` API Base URL: http://localhost:${port}/auth`);
  console.log(` Admin Records: http://localhost:${port}/auth/admin_records`);
  console.log(`  Make sure frontend is accessing: http://localhost:${port}`);
  console.log(`🔐 JWT_SECRET loaded: ${process.env.JWT_SECRET ? 'Yes ✅' : 'No ❌'}`);
});
