/**
 * Express Application Entry Point
 * Sets up middleware, routes, and error handling
 */

import express from 'express';
import cors from 'cors';
import { config } from './config';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middlewares';

// Create Express application
const app = express();

// ==================== Global Middleware ====================

// CORS - Allow requests from frontend origins
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Request logging in development
if (!config.isProduction) {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} | ${req.method} ${req.path}`);
    next();
  });
}

// ==================== Routes ====================

// API routes
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    data: {
      name: 'Qeema Educational Platform API',
      version: '1.0.0',
      documentation: '/api/health',
    },
  });
});

// ==================== Error Handling ====================

// 404 handler for undefined routes
app.use(notFoundHandler);

// Global error handler - must be last
app.use(errorHandler);

// ==================== Server Start ====================

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🚀 Qeema Backend API Server                              ║
║                                                            ║
║   Environment: ${config.nodeEnv.padEnd(40)}║
║   Port: ${String(PORT).padEnd(47)}║
║   URL: http://localhost:${String(PORT).padEnd(35)}║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});

export default app;

