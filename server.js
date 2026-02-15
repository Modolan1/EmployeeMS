import express from "express";
import cors from 'cors';
import { adminRoute } from "./server/Routes/AdminRoute.js";
import cookieParser from 'cookie-parser';
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = process.env.PORT || 8080;

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS configuration
app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = [
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:5175"
        ];
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Set-Cookie'],
    optionsSuccessStatus: 204
}));

app.use(express.json());
app.use(cookieParser());

/* ✅ ROOT ROUTE (Fix for "Cannot GET /") */
app.get('/', (req, res) => {
    res.status(200).json({
        message: "Employee Admin API is running successfully 🚀"
    });
});

/* Your existing routes */
app.use('/auth', adminRoute);

/* Serve static files */
app.use(express.static(path.join(__dirname, 'public')));

/* Start server (IMPORTANT for AWS) */
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});
