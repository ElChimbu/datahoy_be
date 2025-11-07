/**
 * Type definitions for DataHoy pages
 * These types MUST match exactly with the frontend types
 */

export type ComponentType = 
  | 'Hero'
  | 'ArticleCard'
  | 'ArticleList'
  | 'Section'
  | 'Text'
  | 'Image'
  | 'Container';

export interface ComponentProps {
  [key: string]: any;
}

export interface ComponentDefinition {
  type: ComponentType;
  id: string;
  props: ComponentProps;
  children?: ComponentDefinition[];
}

export interface PageMetadata {
  description?: string;
  keywords?: string[];
  ogImage?: string;
}

/**
 * Page interface matching PageDefinition from frontend
 */
export interface Page {
  id: string;
  slug: string;
  title: string;
  metadata?: PageMetadata;
  components: ComponentDefinition[];
  createdAt?: string;  // Optional, generated in DB
  updatedAt?: string;  // Optional, generated in DB
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Database representation of a page (includes timestamps)
 */
export interface PageDB {
  id: string;
  slug: string;
  title: string;
  metadata: PageMetadata | null;
  components: ComponentDefinition[];
  created_at: Date;
  updated_at: Date;
}

/**
 * Request body for creating/updating a page
 */
export interface CreatePageRequest {
  slug: string;
  title: string;
  metadata?: PageMetadata;
  components: ComponentDefinition[];
}

export interface UpdatePageRequest extends CreatePageRequest {}

