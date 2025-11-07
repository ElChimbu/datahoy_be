-- ============================================
-- Migration: Create pages table for DataHoy
-- Compatible with Neon PostgreSQL
-- ============================================

-- Enable UUID extension (Neon supports this)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create pages table
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  metadata JSONB,
  components JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to update updated_at on row update
DROP TRIGGER IF EXISTS update_pages_updated_at ON pages;
CREATE TRIGGER update_pages_updated_at 
    BEFORE UPDATE ON pages
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Verify table was created
SELECT 'Pages table created successfully' AS status;
