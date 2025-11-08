import { PageModel } from '../models/Page.model.js';
import { Page, CreatePageRequest, UpdatePageRequest } from '../types/page.types';
import { ApiError } from '../middleware/errorHandler.js';

/**
 * Pages Service - Business logic for pages
 */
export class PagesService {
  /**
   * Get all pages
   */
  static async getAllPages(): Promise<Page[]> {
    return await PageModel.findAll();
  }

  /**
   * Get page by slug (supports nested slugs)
   */
  static async getPageBySlug(slug: string): Promise<Page> {
    const page = await PageModel.findBySlug(slug);
    
    if (!page) {
      throw new ApiError(404, 'Page not found');
    }
    
    return page;
  }

  /**
   * Get page by ID
   */
  static async getPageById(id: string): Promise<Page> {
    const page = await PageModel.findById(id);
    
    if (!page) {
      throw new ApiError(404, 'Page not found');
    }
    
    return page;
  }

  /**
   * Create a new page
   */
  static async createPage(pageData: CreatePageRequest): Promise<Page> {
    
    // Check if slug already exists
    const slugExists = await PageModel.slugExists(pageData.slug);
    
    if (slugExists) {
      throw new ApiError(409, 'A page with this slug already exists');
    }
    
    return await PageModel.create(pageData);
  }

  /**
   * Update an existing page
   */
  static async updatePage(id: string, pageData: UpdatePageRequest): Promise<Page> {
    // Check if page exists
    const existingPage = await PageModel.findById(id);
    
    if (!existingPage) {
      throw new ApiError(404, 'Page not found');
    }
    
    // Check if new slug conflicts with another page
    if (pageData.slug !== existingPage.slug) {
      const slugExists = await PageModel.slugExists(pageData.slug, id);
      
      if (slugExists) {
        throw new ApiError(409, 'A page with this slug already exists');
      }
    }
    
    const updatedPage = await PageModel.update(id, pageData);
    
    if (!updatedPage) {
      throw new ApiError(404, 'Page not found');
    }
    
    return updatedPage;
  }

  /**
   * Delete a page
   */
  static async deletePage(id: string): Promise<void> {
    const deleted = await PageModel.delete(id);
    
    if (!deleted) {
      throw new ApiError(404, 'Page not found');
    }
  }
}

