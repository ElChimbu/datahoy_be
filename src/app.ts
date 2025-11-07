import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './db/connection';
import pagesRoutes from './routes/pages.routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

// Initialize database connection
db.initialize();

// Middleware
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'DataHoy API is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
// Handle all slug-based GET routes (both single and nested slugs)
// This handles paths like /api/pages/home and /api/pages/noticias/tecnologia
// Express wildcard * matches multiple segments at app level
app.get('/api/pages/*', async (req: Request, res: Response, next) => {
  const fullPath = req.path; // e.g., "/api/pages/noticias/tecnologia" or "/api/pages/home"
  
  // Skip if this is exactly /api/pages (handled by router) or starts with /api/pages/id/
  if (fullPath === '/api/pages' || fullPath.startsWith('/api/pages/id/')) {
    return next();
  }
  
  // Extract slug (everything after /api/pages/)
  const slug = fullPath.replace(/^\/api\/pages\//, '').replace(/^\//, '');
  
  // Handle all slug routes (both single-segment and nested) at app level
  if (slug) {
    // Set slug in params and call controller
    (req.params as any).slug = slug;
    const { PagesController } = await import('./controllers/pages.controller');
    return PagesController.getPageBySlug(req, res, next);
  }
  
  next();
});

// Mount the pages router (handles /api/pages, /api/pages/id/:id, POST, PUT, DELETE)
app.use('/api/pages', pagesRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 CORS enabled for ${CORS_ORIGIN}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await db.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  await db.close();
  process.exit(0);
});

export default app;

