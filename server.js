import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import meetingRoutes from './routes/meetings.js';
import { errorHandler } from './middleware/errorHandler.js';

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/meetings', meetingRoutes);

// ── Error handler ─────────────────────────────────────────────────────────────
app.use(errorHandler);

// ── Database + Server ─────────────────────────────────────────────────────────
async function start() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('[MongoDB] Connected');
  } catch (err) {
    console.warn('[MongoDB] Connection failed — running without persistence:', err.message);
  }

  app.listen(PORT, () => {
    console.log(`[Server] Running on http://localhost:${PORT}`);
  });
}

start();
