# DataHoy Backend

Backend REST API for DataHoy news system built with Node.js, Express.js, TypeScript, and PostgreSQL (NeonSQL).

## Features

- RESTful API for managing page definitions
- Support for nested slugs (e.g., `noticias/tecnologia`)
- Type-safe TypeScript implementation
- PostgreSQL database with JSONB for flexible component storage
- Comprehensive validation and error handling
- CORS enabled for frontend integration

## Prerequisites

- Node.js 18 or higher
- PostgreSQL database (NeonSQL recommended)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd datahoy-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname
CORS_ORIGIN=http://localhost:3000
```

4. Run database migrations:
```bash
npm run migrate
```

5. (Optional) Seed the database with example data:
```bash
npm run seed
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with example data

## API Endpoints

### GET /api/pages
Get all pages.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "slug": "home",
      "title": "Página Principal",
      "metadata": {...},
      "components": [...],
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### GET /api/pages/:slug or /api/pages/*
Get a page by slug. Supports both single-segment slugs (e.g., `/api/pages/home`) and nested slugs (e.g., `/api/pages/noticias/tecnologia`).

**Parameters:**
- `slug` (path): The page slug (can contain forward slashes for nested routes)

**Examples:**
- `/api/pages/home` - Single-segment slug
- `/api/pages/noticias/tecnologia` - Nested slug

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "slug": "home",
    "title": "Página Principal",
    "metadata": {...},
    "components": [...],
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
}
```

### GET /api/pages/id/:id
Get a page by ID (UUID).

**Parameters:**
- `id` (path): The page UUID

### POST /api/pages
Create a new page.

**Request Body:**
```json
{
  "slug": "home",
  "title": "Página Principal",
  "metadata": {
    "description": "...",
    "keywords": ["..."],
    "ogImage": "..."
  },
  "components": [
    {
      "type": "Hero",
      "id": "hero-1",
      "props": {...}
    }
  ]
}
```

### PUT /api/pages/:id
Update an existing page.

**Parameters:**
- `id` (path): The page UUID

**Request Body:** Same as POST

### DELETE /api/pages/:id
Delete a page.

**Parameters:**
- `id` (path): The page UUID

## Project Structure

```
datahoy-backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── middleware/      # Express middleware
│   ├── db/              # Database connection and scripts
│   ├── types/           # TypeScript type definitions
│   └── app.ts           # Application entry point
├── migrations/          # Database migrations
├── package.json
├── tsconfig.json
└── .env.example
```

## Type Definitions

The backend uses TypeScript types that match the frontend types exactly:

- `ComponentType`: Valid component types (Hero, ArticleCard, etc.)
- `ComponentDefinition`: Component structure with type, id, props, and children
- `PageMetadata`: SEO metadata (description, keywords, ogImage)
- `Page`: Complete page definition

## Database Schema

The `pages` table stores:
- `id` (UUID): Primary key
- `slug` (VARCHAR): Unique page identifier (supports nested paths)
- `title` (VARCHAR): Page title
- `metadata` (JSONB): Optional SEO metadata
- `components` (JSONB): Array of component definitions
- `created_at` (TIMESTAMP): Creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp (auto-updated)

## Error Handling

All errors are returned in a consistent format:

```json
{
  "success": false,
  "error": "Error message"
}
```

HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `409` - Conflict (duplicate slug)
- `500` - Internal Server Error

## Development

The project uses:
- **TypeScript** for type safety
- **Express.js** for the web framework
- **pg** (node-postgres) for PostgreSQL connectivity
- **dotenv** for environment variables
- **CORS** for cross-origin requests

## License

ISC

