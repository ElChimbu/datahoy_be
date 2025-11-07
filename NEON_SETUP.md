# Configuración de Neon Database para DataHoy

Esta guía te ayudará a configurar Neon PostgreSQL para el backend de DataHoy.

## Paso 1: Crear una cuenta en Neon

1. Ve a [neon.tech](https://neon.tech)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto

## Paso 2: Obtener la Connection String

1. En el dashboard de Neon, ve a tu proyecto
2. Ve a la sección "Connection Details" o "Connection String"
3. Copia la connection string. Debería verse así:

```
postgresql://username:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

## Paso 3: Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://username:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
CORS_ORIGIN=http://localhost:3000
```

**⚠️ IMPORTANTE:** 
- Reemplaza la `DATABASE_URL` con tu connection string real de Neon
- La connection string de Neon ya incluye los parámetros SSL necesarios
- **NUNCA** subas el archivo `.env` a Git (ya está en `.gitignore`)

## Paso 4: Ejecutar las Migraciones SQL

Tienes dos opciones:

### Opción A: Usar el script de migración de Node.js

```bash
npm run migrate
```

### Opción B: Ejecutar SQL manualmente en Neon

1. Ve al dashboard de Neon
2. Abre la consola SQL (SQL Editor)
3. Copia y pega el contenido del archivo `setup-neon.sql`
4. Ejecuta el script

## Paso 5: (Opcional) Insertar Datos de Prueba

Ejecuta el script de seed:

```bash
npm run seed
```

O ejecuta manualmente el INSERT que está al final del archivo `setup-neon.sql`.

## Paso 6: Verificar la Conexión

Inicia el servidor de desarrollo:

```bash
npm run dev
```

Deberías ver en la consola:
```
✅ Database connected successfully to Neon
🚀 Server running on port 3001
```

## Sentencias SQL Completas

Si necesitas ejecutar las sentencias manualmente, aquí están todas:

```sql
-- 1. Habilitar extensión UUID
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

## Solución de Problemas

### Error: "SSL connection required"
- Asegúrate de que tu connection string incluye `?sslmode=require`
- La conexión está configurada para usar SSL automáticamente

### Error: "Connection timeout"
- Verifica que tu connection string sea correcta
- Asegúrate de que tu IP no esté bloqueada (Neon permite todas las IPs por defecto)
- Verifica tu conexión a internet

### Error: "Extension uuid-ossp does not exist"
- Neon debería tener esta extensión habilitada por defecto
- Si no, ejecuta: `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`

### Error: "Table already exists"
- Si la tabla ya existe, puedes eliminarla con: `DROP TABLE IF EXISTS pages CASCADE;`
- Luego vuelve a ejecutar las migraciones

## Verificar que Todo Funciona

Ejecuta esta query en la consola SQL de Neon:

```sql
-- Verificar tabla
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'pages';

-- Verificar índice
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'pages';

-- Verificar trigger
SELECT trigger_name, event_manipulation, event_object_table 
FROM information_schema.triggers 
WHERE event_object_table = 'pages';

-- Contar páginas
SELECT COUNT(*) as total_pages FROM pages;
```

## Recursos

- [Documentación de Neon](https://neon.tech/docs)
- [Connection Strings en Neon](https://neon.tech/docs/connect/connect-from-any-app)
- [PostgreSQL JSONB](https://www.postgresql.org/docs/current/datatype-json.html)

