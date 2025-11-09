import { Router } from 'express';
import { PagesController } from '../controllers/pages.controller.js';
import { validatePageData, validateUUID } from '../middleware/validation.js';

const router = Router();

/**
 * Pages Routes
 * 
 * IMPORTANT: The order of routes matters!
 * More specific routes (like /id/:id) must come before
 * parameter routes to avoid conflicts.
 * 
 * Note: Slug-based GET routes are handled at app level in app.ts
 * to support nested slugs like "noticias/tecnologia"
 */

// GET /api/pages/id/:id - Get page by ID
router.get('/id/:id', validateUUID, PagesController.getPageById);

// GET /api/pages - Get all pages
// Note: Slug-based routes (both single and nested) are handled at app level
// in app.ts using app.get('/api/pages/*', ...)
router.get('/', PagesController.getAllPages);

// GET /api/pages/:slug - Get page by slug
router.get('/:slug', PagesController.getPageBySlug);

// POST /api/pages - Create a new page
router.post('/', validatePageData, PagesController.createPage);

// PUT /api/pages/:id - Update a page
router.put('/:id', validateUUID, validatePageData, PagesController.updatePage);

// DELETE /api/pages/:id - Delete a page
router.delete('/:id', validateUUID, PagesController.deletePage);

export default router;

