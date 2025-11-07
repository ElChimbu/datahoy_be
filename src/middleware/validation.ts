import { Request, Response, NextFunction } from 'express';
import { CreatePageRequest, ComponentDefinition, ComponentType } from '../types/page.types';

/**
 * Valid component types
 */
const VALID_COMPONENT_TYPES: ComponentType[] = [
  'Hero',
  'ArticleCard',
  'ArticleList',
  'Section',
  'Text',
  'Image',
  'Container',
];

/**
 * Validate slug format
 * Slug can contain letters, numbers, hyphens, and forward slashes
 */
function validateSlug(slug: string): boolean {
  const slugRegex = /^[a-zA-Z0-9\/\-]+$/;
  return slugRegex.test(slug);
}

/**
 * Validate component structure recursively
 */
function validateComponent(component: any, depth: number = 0): string | null {
  // Prevent infinite nesting
  if (depth > 10) {
    return 'Component nesting too deep (max 10 levels)';
  }

  if (!component) {
    return 'Component is required';
  }

  if (!component.type) {
    return 'Component type is required';
  }

  if (!VALID_COMPONENT_TYPES.includes(component.type)) {
    return `Invalid component type: ${component.type}`;
  }

  if (!component.id || typeof component.id !== 'string') {
    return 'Component id is required and must be a string';
  }

  if (!component.props || typeof component.props !== 'object') {
    return 'Component props is required and must be an object';
  }

  // Validate children recursively
  if (component.children) {
    if (!Array.isArray(component.children)) {
      return 'Component children must be an array';
    }

    for (const child of component.children) {
      const error = validateComponent(child, depth + 1);
      if (error) {
        return error;
      }
    }
  }

  return null;
}

/**
 * Validate page data for create/update
 */
export function validatePageData(req: Request, res: Response, next: NextFunction) {
  const { slug, title, metadata, components } = req.body;

  // Validate slug
  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Validation failed: slug is required and must be a string',
    });
  }

  if (!validateSlug(slug)) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed: slug can only contain letters, numbers, hyphens, and forward slashes',
    });
  }

  // Validate title
  if (!title || typeof title !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Validation failed: title is required and must be a string',
    });
  }

  if (title.length > 255) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed: title must be 255 characters or less',
    });
  }

  // Validate metadata (optional)
  if (metadata !== undefined) {
    if (typeof metadata !== 'object' || metadata === null || Array.isArray(metadata)) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed: metadata must be an object',
      });
    }

    if (metadata.description && typeof metadata.description !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Validation failed: metadata.description must be a string',
      });
    }

    if (metadata.keywords && !Array.isArray(metadata.keywords)) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed: metadata.keywords must be an array',
      });
    }

    if (metadata.ogImage && typeof metadata.ogImage !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Validation failed: metadata.ogImage must be a string',
      });
    }
  }

  // Validate components
  if (!components) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed: components is required',
    });
  }

  if (!Array.isArray(components)) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed: components must be an array',
    });
  }

  if (components.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed: components array cannot be empty',
    });
  }

  // Validate each component
  for (const component of components) {
    const error = validateComponent(component);
    if (error) {
      return res.status(400).json({
        success: false,
        error: `Validation failed: ${error}`,
      });
    }
  }

  next();
}

/**
 * Validate UUID format
 */
export function validateUUID(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
  if (!uuidRegex.test(id)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid UUID format',
    });
  }

  next();
}

