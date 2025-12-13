-- Database performance optimizations
-- Created: 2025-12-13
-- Purpose: Add missing indexes and improve query performance

-- 1. Add index for region filtering (commonly used in filters and search)
CREATE INDEX IF NOT EXISTS idx_wines_region ON wines(region) WHERE region IS NOT NULL AND region != '';

-- 2. Add index for grape variety filtering (commonly used in filters and search)
CREATE INDEX IF NOT EXISTS idx_wines_druva ON wines(druva) WHERE druva IS NOT NULL AND druva != '';

-- 3. Add composite index for common query pattern: user_id + sorting by date
-- This is the most common query pattern in the app
CREATE INDEX IF NOT EXISTS idx_wines_user_date ON wines(user_id, datum_tillagd DESC);

-- 4. Add GIN index for full-text search on wine names
-- This enables fast ILIKE queries for searching wine names
CREATE INDEX IF NOT EXISTS idx_wines_vin_namn_trgm ON wines USING gin(vin_namn gin_trgm_ops);

-- 5. Add GIN index for full-text search on producer names
CREATE INDEX IF NOT EXISTS idx_wines_producent_trgm ON wines USING gin(producent gin_trgm_ops);

-- 6. Add GIN index for full-text search on grape varieties
CREATE INDEX IF NOT EXISTS idx_wines_druva_trgm ON wines USING gin(druva gin_trgm_ops);

-- 7. Add composite index for "wines at home" queries sorted by date
-- Optimizes the home wines view
CREATE INDEX IF NOT EXISTS idx_wines_home_date ON wines(user_id, ar_hemma, datum_tillagd DESC) WHERE ar_hemma = true;

-- 8. Add index for wines with ratings (for sorting/filtering by rating)
CREATE INDEX IF NOT EXISTS idx_wines_betyg ON wines(betyg DESC) WHERE betyg IS NOT NULL;

-- Note: To enable the trigram indexes (gin_trgm_ops), you need to enable the pg_trgm extension first.
-- Run this in Supabase SQL editor if not already enabled:
-- CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Query performance tips:
-- 1. The composite indexes (idx_wines_user_date, idx_wines_home_date) will speed up:
--    - Main wine list queries
--    - Home wines queries
--
-- 2. The GIN trigram indexes will enable fast fuzzy/partial text search:
--    - Searching for wine names
--    - Searching for producers
--    - Searching for grape varieties
--
-- 3. Partial indexes (with WHERE clauses) save storage space and improve performance
--    by only indexing relevant rows

-- Performance monitoring query (run in Supabase to check index usage):
-- SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
-- FROM pg_stat_user_indexes
-- WHERE schemaname = 'public' AND tablename = 'wines'
-- ORDER BY idx_scan DESC;
