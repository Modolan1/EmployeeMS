import express from "express";
import cors from 'cors'
import { adminRoute } from "./server/Routes/AdminRoute.js";
import cookieParser from 'cookie-parser';

const app = express();
const port = process.env.PORT || 3000;

// CORS configuration
app.get('/', (req, res) => {
  res.send('Application is running successfully 🚀');
});
app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"];
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
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

app.use(express.json())
app.use(cookieParser())
app.use('/auth', adminRoute)
app.use(express.static('public'))

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
})

