import { Request, Response } from 'express';
import { PagesService } from '../services/pages.service.js';
import { ApiResponse, Page } from '../types/page.types';

/**
 * Pages Controller - Handle HTTP requests for pages
 */
export class PagesController {
  /**
   * GET /api/pages
   * Get all pages
   */
  static async getAllPages(_req: Request, res: Response) {
    try {
      const pages = await PagesService.getAllPages();
      
      const response: ApiResponse<Page[]> = {
        success: true,
        data: pages,
      };
      
      res.status(200).json(response);
    } catch (error) {
      console.error('Error in getAllPages:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  /**
   * GET /api/pages/:slug or /api/pages/*
   * Get page by slug (supports nested slugs)
   * 
   * IMPORTANT: This handles nested slugs like "noticias/tecnologia"
   * The slug is extracted by the extractSlug middleware from req.path
   */
  static async getPageBySlug(req: Request, res: Response) {
    try {
      console.log('Executing getPageBySlug with params:', req.params);

      const slug = (req.params as any).slug || req.params.slug;

      if (!slug || slug === '') {
        return res.status(400).json({
          success: false,
          error: 'Slug is required',
        });
      }

      const page = await PagesService.getPageBySlug(slug);

      if (!page) {
        return res.status(404).json({
          success: false,
          error: 'Page not found',
        });
      }

      const response: ApiResponse<Page> = {
        success: true,
        data: page,
      };
      
      return res.status(200).json(response);
    } catch (error) {
      console.error('Error in getPageBySlug:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  /**
   * GET /api/pages/id/:id
   * Get page by ID
   */
  static async getPageById(req: Request, res: Response) {
    try {
      console.log('Executing getPageById with params:', req.params);

      const { id } = req.params;
      const page = await PagesService.getPageById(id);
      
      const response: ApiResponse<Page> = {
        success: true,
        data: page,
      };
      
      res.status(200).json(response);
    } catch (error) {
      console.error('Error in getPageById:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  /**
   * POST /api/pages
   * Create a new page
   */
  static async createPage(req: Request, res: Response) {
   
    try {
      const pageData = req.body;
      const page = await PagesService.createPage(pageData);
      
      const response: ApiResponse<Page> = {
        success: true,
        data: page,
      };
      
      res.status(201).json(response);
    } catch (error) {
      console.error('Error in createPage:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  /**
   * PUT /api/pages/:id
   * Update an existing page
   */
  static async updatePage(req: Request, res: Response) {
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
      console.error('Error in updatePage:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  /**
   * DELETE /api/pages/:id
   * Delete a page
   */
  static async deletePage(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await PagesService.deletePage(id);
      
      const response: ApiResponse<{ message: string }> = {
        success: true,
        data: { message: 'Page deleted successfully' },
      };
      
      res.status(200).json(response);
    } catch (error) {
      console.error('Error in deletePage:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
}

