-- Add land (country) and region fields to wines table
ALTER TABLE wines
ADD COLUMN IF NOT EXISTS land TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS region TEXT DEFAULT '';

-- Create index for land field for better query performance
CREATE INDEX IF NOT EXISTS idx_wines_land ON wines(land);

-- Migrate existing data: try to extract country from ursprung field
-- This is a best-effort migration - you may need to clean up data manually
UPDATE wines
SET land = ursprung
WHERE land = '' OR land IS NULL;

-- Add comment to clarify field usage
COMMENT ON COLUMN wines.ursprung IS 'Legacy field - use land and region instead';
COMMENT ON COLUMN wines.land IS 'Country of origin';
COMMENT ON COLUMN wines.region IS 'Wine region';
