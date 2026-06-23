import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './db.js';

// Route Imports
import eventRoutes from './routes/events.js';
import sessionRoutes from './routes/sessions.js';
import heatmapRoutes from './routes/heatmap.js';
import pageStatsRoutes from './routes/pageStats.js';

// Setup environment variables
dotenv.config();

// Resolve paths for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize DB Connection
connectDB();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors()); // Allow all origins for dev
app.use(express.json());
app.use(morgan('dev')); // Dev request logging

// Serve tracker script and other public files statically
app.use(express.static(path.join(__dirname, '../public')));

// Explicit route to serve the demo page at /demo
app.get('/demo', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public/demo.html'));
});

// API Routes
app.use('/api/events', eventRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/heatmap', heatmapRoutes);
app.use('/api/page-stats', pageStatsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Demo page available at http://localhost:${PORT}/demo`);
});
