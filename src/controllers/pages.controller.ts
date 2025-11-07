import { Request, Response, NextFunction } from 'express';
import { PagesService } from '../services/pages.service';
import { ApiResponse, Page } from '../types/page.types';

/**
 * Pages Controller - Handle HTTP requests for pages
 */
export class PagesController {
  /**
   * GET /api/pages
   * Get all pages
   */
  static async getAllPages(req: Request, res: Response, next: NextFunction) {
    try {
      const pages = await PagesService.getAllPages();
      
      const response: ApiResponse<Page[]> = {
        success: true,
        data: pages,
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/pages/:slug or /api/pages/*
   * Get page by slug (supports nested slugs)
   * 
   * IMPORTANT: This handles nested slugs like "noticias/tecnologia"
   * The slug is extracted by the extractSlug middleware from req.path
   */
  static async getPageBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      // Extract slug from params (set by extractSlug middleware)
      // TypeScript doesn't know about the slug property, so we cast
      const slug = (req.params as any).slug || req.params.slug;
      
      if (!slug || slug === '') {
        return res.status(400).json({
          success: false,
          error: 'Slug is required',
        });
      }
      
      const page = await PagesService.getPageBySlug(slug);
      
      const response: ApiResponse<Page> = {
        success: true,
        data: page,
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/pages/id/:id
   * Get page by ID
   */
  static async getPageById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const page = await PagesService.getPageById(id);
      
      const response: ApiResponse<Page> = {
        success: true,
        data: page,
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/pages
   * Create a new page
   */
  static async createPage(req: Request, res: Response, next: NextFunction) {
    try {
      const pageData = req.body;
      const page = await PagesService.createPage(pageData);
      
      const response: ApiResponse<Page> = {
        success: true,
        data: page,
      };
      
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/pages/:id
   * Update an existing page
   */
  static async updatePage(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const pageData = req.body;
      const page = await PagesService.updatePage(id, pageData);
      
      const response: ApiResponse<Page> = {
        success: true,
        data: page,
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/pages/:id
   * Delete a page
   */
  static async deletePage(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await PagesService.deletePage(id);
      
      const response: ApiResponse<{ message: string }> = {
        success: true,
        data: { message: 'Page deleted successfully' },
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

