import mongoose from 'mongoose';

// Retry forever with capped backoff instead of exiting. A dead/renamed Atlas cluster used to
// kill the process 2ms after listen(), so the host restart-looped and every request hung with
// zero bytes. Staying up means /health answers and DB routes return a clean 503.
// ponytail: fixed backoff schedule, no jitter — fine for a single instance.
const RETRY_DELAYS_MS = [1000, 2000, 5000, 10000, 30000];

let attempt = 0;

const connectDB = async () => {
  // Keeps the smoke suite hermetic: it exercises the disconnected code paths without dialing
  // whatever cluster the developer's .env happens to point at.
  if (process.env.NODE_ENV === 'test') {
    console.log('[db] NODE_ENV=test — skipping database connection.');
    return;
  }

  if (!process.env.MONGO_URI) {
    console.error('[db] MONGO_URI is not set — starting without a database connection.');
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000
    });
    attempt = 0;
    console.log(`[db] MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    const delay = RETRY_DELAYS_MS[Math.min(attempt, RETRY_DELAYS_MS.length - 1)];
    attempt += 1;
    // Log the reason but never the URI — it carries credentials.
    console.error(`[db] Connection failed (attempt ${attempt}): ${error.message}`);
    console.error(`[db] Retrying in ${delay / 1000}s. HTTP server stays up; DB routes return 503.`);
    setTimeout(connectDB, delay).unref();
  }
};

export const isDbConnected = () => mongoose.connection.readyState === 1;

export default connectDB;
