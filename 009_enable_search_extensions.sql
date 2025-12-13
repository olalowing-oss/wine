-- Enable PostgreSQL extensions for better search performance
-- Run this BEFORE 010_optimize_database_indexes.sql

-- Enable pg_trgm extension for trigram-based text search
-- This enables fast ILIKE and similarity searches
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- The pg_trgm extension provides:
-- 1. Fast pattern matching (ILIKE queries)
-- 2. Similarity searches
-- 3. GIN indexes for text columns
--
-- After enabling this extension, you can create GIN indexes on text columns
-- for much faster text search compared to regular B-tree indexes
