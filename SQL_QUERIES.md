# Sentencias SQL para Neon Database

Este documento contiene todas las sentencias SQL necesarias para configurar la base de datos de DataHoy en Neon.

## 📋 Tabla de Contenidos

1. [Sentencias de Configuración Inicial](#sentencias-de-configuración-inicial)
2. [Crear Tabla y Estructura](#crear-tabla-y-estructura)
3. [Índices](#índices)
4. [Triggers y Funciones](#triggers-y-funciones)
5. [Datos de Prueba](#datos-de-prueba)
6. [Consultas de Verificación](#consultas-de-verificación)
7. [Mantenimiento](#mantenimiento)

---

## Sentencias de Configuración Inicial

### 1. Habilitar Extensión UUID

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

**Descripción:** Habilita la extensión para generar UUIDs. Neon ya tiene esta extensión disponible por defecto, pero es buena práctica verificarlo.

---

## Crear Tabla y Estructura

### 2. Crear Tabla `pages`

```sql
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  metadata JSONB,
  components JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Campos:**
- `id`: UUID único generado automáticamente
- `slug`: Identificador único de la página (puede contener barras para rutas anidadas)
- `title`: Título de la página
- `metadata`: Metadatos SEO en formato JSONB (opcional)
- `components`: Array de componentes en formato JSONB (requerido)
- `created_at`: Timestamp de creación (automático)
- `updated_at`: Timestamp de actualización (automático)

---

## Índices

### 3. Crear Índice en `slug`

```sql
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
```

**Propósito:** Acelera las búsquedas por slug, que es la consulta más frecuente.

---

## Triggers y Funciones

### 4. Crear Función para Actualizar `updated_at`

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';
```

**Descripción:** Función que actualiza automáticamente el campo `updated_at` cuando se modifica una fila.

### 5. Crear Trigger

```sql
DROP TRIGGER IF EXISTS update_pages_updated_at ON pages;
CREATE TRIGGER update_pages_updated_at 
    BEFORE UPDATE ON pages
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

**Descripción:** Trigger que ejecuta la función anterior antes de cada actualización.

---

## Datos de Prueba

### 6. Insertar Página de Ejemplo

```sql
INSERT INTO pages (slug, title, metadata, components)
VALUES (
  'home',
  'Bienvenido a DataHoy',
  '{
    "description": "Página principal de DataHoy",
    "keywords": ["noticias", "datahoy"],
    "ogImage": "https://example.com/og-image.jpg"
  }'::jsonb,
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
        },
        {
          "type": "ArticleCard",
          "id": "article-2",
          "props": {
            "title": "Otra Noticia Importante",
            "excerpt": "Contenido de otra noticia importante para los lectores.",
            "image": "https://images.unsplash.com/photo-1495020689067-958852a7765e",
            "author": "Editor DataHoy",
            "publishedAt": "2024-01-14T15:30:00Z",
            "category": "Política",
            "link": "/noticias/otra-noticia"
          }
        }
      ]
    }
  ]'::jsonb
)
ON CONFLICT (slug) DO NOTHING;
```

**Nota:** El `ON CONFLICT DO NOTHING` evita errores si la página ya existe.

---

## Consultas de Verificación

### 7. Verificar Estructura de la Tabla

```sql
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'pages'
ORDER BY ordinal_position;
```

### 8. Verificar Índices

```sql
SELECT 
  indexname, 
  indexdef 
FROM pg_indexes 
WHERE tablename = 'pages';
```

### 9. Verificar Triggers

```sql
SELECT 
  trigger_name, 
  event_manipulation, 
  event_object_table,
  action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'pages';
```

### 10. Contar Páginas

```sql
SELECT COUNT(*) as total_pages FROM pages;
```

### 11. Listar Todas las Páginas

```sql
SELECT 
  id, 
  slug, 
  title, 
  created_at, 
  updated_at 
FROM pages 
ORDER BY created_at DESC;
```

### 12. Ver una Página Completa

```sql
SELECT * FROM pages WHERE slug = 'home';
```

### 13. Verificar Páginas con Slugs Anidados

```sql
SELECT slug, title 
FROM pages 
WHERE slug LIKE '%/%'
ORDER BY slug;
```

---

## Mantenimiento

### 14. Eliminar Todas las Páginas (Cuidado!)

```sql
DELETE FROM pages;
```

### 15. Eliminar Tabla (Reset Completo)

```sql
DROP TABLE IF EXISTS pages CASCADE;
```

**⚠️ ADVERTENCIA:** Esto eliminará todos los datos y la estructura de la tabla.

### 16. Reiniciar Secuencia de IDs (si fuera necesario)

```sql
-- No es necesario para UUIDs, pero aquí está por si acaso
-- Los UUIDs se generan automáticamente con gen_random_uuid()
```

### 17. Vaciar Tabla pero Mantener Estructura

```sql
TRUNCATE TABLE pages RESTART IDENTITY CASCADE;
```

### 18. Actualizar Todas las Timestamps

```sql
UPDATE pages 
SET updated_at = CURRENT_TIMESTAMP;
```

---

## Script Completo de Setup

Puedes ejecutar todas las sentencias de una vez copiando el contenido del archivo `setup-neon.sql` en la consola SQL de Neon.

---

## Ejemplos de Consultas Útiles

### Buscar Páginas por Título

```sql
SELECT slug, title 
FROM pages 
WHERE title ILIKE '%noticia%';
```

### Buscar Páginas con Metadata Específica

```sql
SELECT slug, title, metadata 
FROM pages 
WHERE metadata->>'description' IS NOT NULL;
```

### Buscar Páginas por Componente

```sql
SELECT slug, title 
FROM pages 
WHERE components::text LIKE '%Hero%';
```

### Actualizar Metadata de una Página

```sql
UPDATE pages 
SET metadata = jsonb_set(
  COALESCE(metadata, '{}'::jsonb), 
  '{description}', 
  '"Nueva descripción"'::jsonb
)
WHERE slug = 'home';
```

### Agregar Keyword a Metadata

```sql
UPDATE pages 
SET metadata = jsonb_set(
  COALESCE(metadata, '{}'::jsonb),
  '{keywords}',
  COALESCE(metadata->'keywords', '[]'::jsonb) || '["nueva-keyword"]'::jsonb
)
WHERE slug = 'home';
```

---

## Notas Importantes

1. **JSONB**: Neon soporta completamente JSONB, lo que permite consultas eficientes sobre los componentes y metadata.

2. **Slugs Anidados**: Los slugs pueden contener barras (ej: `noticias/tecnologia`). Asegúrate de que sean únicos.

3. **Timestamps**: Los campos `created_at` y `updated_at` se actualizan automáticamente gracias al trigger.

4. **UUIDs**: Los IDs se generan automáticamente usando `gen_random_uuid()`, que está disponible en PostgreSQL 13+ (Neon lo soporta).

5. **SSL**: Neon requiere conexiones SSL. El connection string ya incluye los parámetros necesarios.

---

## Recursos

- [Documentación de Neon](https://neon.tech/docs)
- [PostgreSQL JSONB](https://www.postgresql.org/docs/current/datatype-json.html)
- [PostgreSQL UUID](https://www.postgresql.org/docs/current/datatype-uuid.html)

