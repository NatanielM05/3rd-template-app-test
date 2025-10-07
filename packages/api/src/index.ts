import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { db } from '@app/database';
import { healthRouter } from './routes/health.js';
import { tasksRouter } from './routes/tasks.js';
import { errorHandler } from './middleware/error-handler.js';

// Load environment variables
config();

const app = express();
const PORT = process.env.API_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
await db.init();
console.log('✅ Database initialized');

// Routes
app.use('/api/v1/health', healthRouter);
app.use('/api/v1/tasks', tasksRouter);

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/v1/health`);
});
