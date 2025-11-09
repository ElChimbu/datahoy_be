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
   * GET /api/pages/:slug
   * Get page by slug
   */
  static async getPageBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;

      if (!slug || typeof slug !== 'string') {
        return res.status(400).json({ error: 'Invalid slug format' });
      }

      // Buscar el contenido en la base de datos utilizando el slug
      const page = await PagesService.getPageBySlug(slug);

      if (!page) {
        return res.status(404).json({ error: 'Page not found' });
      }

      return res.json({ success: true, data: page });
    } catch (error) {
      console.error('Error fetching page by slug:', error);
      return res.status(500).json({ error: 'Internal server error' });
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

