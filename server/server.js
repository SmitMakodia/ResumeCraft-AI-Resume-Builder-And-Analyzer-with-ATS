import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

// Single config entry point. Loading dotenv here only (previously also in config/ai.js and
// config/imagekit.js) is why the boot log printed "injecting env" three times.
dotenv.config();

import connectDB from './config/db.js';
import { aiLimiter, authLimiter } from './middleware/rateLimit.js';
import { errorHandler, notFound, requireDb } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

connectDB();

export const app = express();

// Render terminates TLS at its edge proxy. Without this, every client shares the proxy's IP and
// the rate limiters below would throttle all users as one.
app.set('trust proxy', 1);

// Was `cors()` — open to every origin. Allow-list is comma-separated so preview deploys can be
// added without a code change; unset means allow all, which keeps local dev frictionless.
const allowedOrigins = process.env.CORS_ORIGIN?.split(',').map((o) => o.trim()).filter(Boolean);
app.use(
  cors({
    origin: (origin, cb) => {
      if (!allowedOrigins?.length) return cb(null, true);
      // No Origin header: curl, health checks, same-origin server calls.
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error(`Origin not allowed: ${origin}`));
    }
  })
);

app.use(express.json({ limit: '1mb' }));

// Liveness + dependency status. Reports 200 whenever the process is serving so the platform does
// not restart a healthy instance during a database outage; read `db` to distinguish the two.
const DB_STATES = ['disconnected', 'connected', 'connecting', 'disconnecting'];
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    db: DB_STATES[mongoose.connection.readyState] ?? 'unknown',
    uptimeSeconds: Math.round(process.uptime())
  });
});

// Middleware order per router is deliberate: rate limit → database guard → route.
//   - Limiter first: it is the cheapest possible rejection, and it must still shed load during a
//     database outage rather than being short-circuited by the 503.
//   - requireDb per router, not on the whole /api prefix: mounting it at /api made unknown paths
//     answer 503 instead of 404, and hid the limiter entirely. Every route below does need the
//     database, including the AI ones, because `protect` looks the user up.
app.use('/api/auth', authLimiter, requireDb, authRoutes);
app.use('/api/resumes', requireDb, resumeRoutes);
app.use('/api/ai', aiLimiter, requireDb, aiRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Guard so the smoke tests can import `app` without binding a port.
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
