import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

const app = express();

app.use((req, res, next) => {
  console.log("REQUEST:", req.method, req.url);
  next();
});

// import "./config/passport.js";

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import goalRoutes from "./routes/goalRoutes.js";
import financeRoutes from "./routes/financeRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

import { notFound, errorHandler } from './middleware/errorMiddleware.js';



// Middleware setup
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// app.options(/.*/, cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(morgan('dev'));

// Health check endpoint
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error handlers
console.log("MOUNTING ERROR HANDLERS...");
app.use(notFound);
app.use(errorHandler);

export default app;
