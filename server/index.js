import express from 'express';
import cors from 'cors';
import { initDb } from './db.js';
import { seedDatabase } from './seed.js';

import authRoutes from './routes/auth.js';
import questionRoutes from './routes/questions.js';
import codeRoutes from './routes/code.js';
import resumeRoutes from './routes/resume.js';
import reportRoutes from './routes/reports.js';
import interviewRoutes from './routes/interview.js';

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize SQLite Persistent Database & Seed Data
initDb().then(async () => {
  console.log('Database schema ready.');
  await seedDatabase();
}).catch(err => {
  console.error('Failed to initialize database:', err);
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/code', codeRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/interview', interviewRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'ALGOOlympia AI Backend',
    database: 'SQLite Persistent DB',
    timestamp: new Date().toISOString(),
  });
});

const server = app.listen(PORT, () => {
  console.log(`🚀 ALGOOlympia Backend Express Server running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`ℹ️ ALGOOlympia Backend Server is already active and running on http://localhost:${PORT}`);
  } else {
    console.error('Server error:', err);
  }
});
