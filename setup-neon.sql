-- ============================================
-- Setup Script for Neon PostgreSQL Database
-- Ejecuta este script en tu consola SQL de Neon
-- ============================================

-- 1. Habilitar extensión UUID (si no está habilitada)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Crear tabla pages
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  metadata JSONB,
  components JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Crear índice en slug para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);

-- 4. Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. Crear trigger para actualizar updated_at en cada UPDATE
DROP TRIGGER IF EXISTS update_pages_updated_at ON pages;
CREATE TRIGGER update_pages_updated_at 
    BEFORE UPDATE ON pages
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 6. (Opcional) Insertar página de ejemplo
INSERT INTO pages (slug, title, metadata, components)
VALUES (
  'home',
  'Bienvenido a DataHoy',
  '{"description": "Página principal de DataHoy", "keywords": ["noticias", "datahoy"], "ogImage": "https://example.com/og-image.jpg"}'::jsonb,
  '[
    {
      "type": "Hero",
      "id": "hero-1",
      "props": {
        "title": "Bienvenido a DataHoy",
        "subtitle": "Las últimas noticias al instante",
        "ctaText": "Ver Noticias",
        "ctaLink": "/noticias"
      }
    },
    {
      "type": "ArticleList",
      "id": "article-list-1",
      "props": {
        "title": "Últimas Noticias",
        "columns": 3
      },
      "children": [
        {
          "type": "ArticleCard",
          "id": "article-1",
          "props": {
            "title": "Ejemplo de Noticia",
            "excerpt": "Esta es una noticia de ejemplo que muestra cómo funciona el sistema.",
            "image": "https://images.unsplash.com/photo-1504711434969-e33886168f5c",
            "author": "Editor DataHoy",
            "publishedAt": "2024-01-15T10:00:00Z",
            "category": "Tecnología",
            "link": "/noticias/ejemplo"
          }
        }
      ]
    }
  ]'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

-- 7. Verificar que todo se creó correctamente
SELECT 
  'Tables created' AS status,
  (SELECT COUNT(*) FROM pages) AS pages_count;

