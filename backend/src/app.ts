import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './modules/auth/auth.routes';
import subjectsRoutes from './modules/subjects/subjects.routes';
import videosRoutes from './modules/videos/videos.routes';
import progressRoutes from './modules/progress/progress.routes';
import healthRoutes from './modules/health/health.routes';
import { errorMiddleware } from './middleware/error.middleware';

dotenv.config();

const app = express();

// 1. CORS MUST be first to handle preflight OPTIONS
app.use(cors({
  origin: true, // Allow all origins for debugging
  credentials: true,
}));

// 2. Explicitly handle all OPTIONS preflights
app.options(/.*/, cors());

// 3. Logger after CORS
app.use((req: any, res: any, next: any) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectsRoutes);
app.use('/api/videos', videosRoutes);
app.use('/api/progress', progressRoutes);

// Error Middleware
app.use(errorMiddleware);

export default app;
