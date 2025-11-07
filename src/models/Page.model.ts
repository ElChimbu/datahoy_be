import db from '../db/connection';
import { Page, PageDB, CreatePageRequest, UpdatePageRequest } from '../types/page.types';

/**
 * Convert database row to Page interface
 */
function dbRowToPage(row: PageDB): Page {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    metadata: row.metadata || undefined,
    components: row.components,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

/**
 * Page Model - Database operations for pages
 */
export class PageModel {
  /**
   * Get all pages
   */
  static async findAll(): Promise<Page[]> {
    const result = await db.query(
      'SELECT * FROM pages ORDER BY created_at DESC'
    );
    return result.rows.map(dbRowToPage);
  }

  /**
   * Find page by slug (supports nested slugs)
   */
  static async findBySlug(slug: string): Promise<Page | null> {
    const result = await db.query(
      'SELECT * FROM pages WHERE slug = $1',
      [slug]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return dbRowToPage(result.rows[0]);
  }

  /**
   * Find page by ID
   */
  static async findById(id: string): Promise<Page | null> {
    const result = await db.query(
      'SELECT * FROM pages WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return dbRowToPage(result.rows[0]);
  }

  /**
   * Check if slug exists (for validation)
   */
  static async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    let query = 'SELECT COUNT(*) FROM pages WHERE slug = $1';
    const params: any[] = [slug];
    
    if (excludeId) {
      query += ' AND id != $2';
      params.push(excludeId);
    }
    
    const result = await db.query(query, params);
    return parseInt(result.rows[0].count) > 0;
  }

  /**
   * Create a new page
   */
  static async create(pageData: CreatePageRequest): Promise<Page> {
    const result = await db.query(
      `INSERT INTO pages (slug, title, metadata, components)
       VALUES ($1, $2, $3::jsonb, $4::jsonb)
       RETURNING *`,
      [
        pageData.slug,
        pageData.title,
        pageData.metadata ? JSON.stringify(pageData.metadata) : null,
        JSON.stringify(pageData.components), // pg accepts JSON strings for JSONB
      ]
    );
    
    return dbRowToPage(result.rows[0]);
  }

  /**
   * Update an existing page
   */
  static async update(id: string, pageData: UpdatePageRequest): Promise<Page | null> {
    const result = await db.query(
      `UPDATE pages 
       SET slug = $1, title = $2, metadata = $3::jsonb, components = $4::jsonb
       WHERE id = $5
       RETURNING *`,
      [
        pageData.slug,
        pageData.title,
        pageData.metadata ? JSON.stringify(pageData.metadata) : null,
        JSON.stringify(pageData.components), // pg accepts JSON strings for JSONB
        id,
      ]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return dbRowToPage(result.rows[0]);
  }

  /**
   * Delete a page
   */
  static async delete(id: string): Promise<boolean> {
    const result = await db.query(
      'DELETE FROM pages WHERE id = $1 RETURNING id',
      [id]
    );
    
    return result.rows.length > 0;
  }
}

