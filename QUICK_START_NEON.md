# 🚀 Quick Start: Configurar Neon para DataHoy

## Paso 1: Obtener Connection String de Neon

1. Ve a [console.neon.tech](https://console.neon.tech)
2. Crea un proyecto o selecciona uno existente
3. Copia el **Connection String** (debería verse así):

```
postgresql://usuario:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
```

## Paso 2: Configurar .env

Crea un archivo `.env` en la raíz del proyecto:

```env
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://usuario:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
CORS_ORIGIN=http://localhost:3000
```

**Reemplaza** `DATABASE_URL` con tu connection string real.

## Paso 3: Ejecutar Migraciones

```bash
npm install
npm run migrate
```

¡Listo! La base de datos está configurada.

---

## 📝 Sentencias SQL Manuales (Si prefieres ejecutarlas manualmente)

Copia y pega estas sentencias en la **consola SQL de Neon**:

```sql
-- 1. Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Crear tabla
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  metadata JSONB,
  components JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Crear índice
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);

-- 4. Crear función para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. Crear trigger
DROP TRIGGER IF EXISTS update_pages_updated_at ON pages;
CREATE TRIGGER update_pages_updated_at 
    BEFORE UPDATE ON pages
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

## Paso 4: (Opcional) Insertar Datos de Prueba

```bash
npm run seed
```

O ejecuta manualmente:

```sql
INSERT INTO pages (slug, title, metadata, components)
VALUES (
  'home',
  'Bienvenido a DataHoy',
  '{"description": "Página principal", "keywords": ["noticias"]}'::jsonb,
  '[{"type": "Hero", "id": "hero-1", "props": {"title": "Bienvenido"}}]'::jsonb
)
ON CONFLICT (slug) DO NOTHING;
```

## Paso 5: Verificar

```bash
npm run dev
```

Deberías ver:
```
✅ Database connected successfully to Neon
🚀 Server running on port 3001
```

---

## ✅ Verificar que Todo Funciona

Ejecuta en la consola SQL de Neon:

```sql
-- Ver estructura de la tabla
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'pages';

-- Contar páginas
SELECT COUNT(*) FROM pages;

-- Ver páginas
SELECT slug, title FROM pages;
```

---

## 🔧 Solución de Problemas

### Error: "SSL connection required"
✅ **Solución:** Asegúrate de que tu connection string incluye `?sslmode=require`

### Error: "Connection timeout"
✅ **Solución:** Verifica tu connection string y conexión a internet

### Error: "Table already exists"
✅ **Solución:** Ejecuta: `DROP TABLE IF EXISTS pages CASCADE;` y vuelve a ejecutar las migraciones

---

Para más detalles, consulta `NEON_SETUP.md` y `SQL_QUERIES.md`

