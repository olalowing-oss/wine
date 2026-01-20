-- Add location fields to menu_pairings table
ALTER TABLE menu_pairings
ADD COLUMN IF NOT EXISTS plats TEXT,
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8),
ADD COLUMN IF NOT EXISTS adress TEXT;

-- Create index for location searches
CREATE INDEX IF NOT EXISTS idx_menu_pairings_plats ON menu_pairings(plats);
