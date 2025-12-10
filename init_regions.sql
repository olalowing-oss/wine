-- Create regions table
-- Run this in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS regions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  alternative_names TEXT[],
  country TEXT NOT NULL,
  parent_region TEXT,
  region_type TEXT NOT NULL CHECK (region_type IN ('country', 'region', 'subregion', 'appellation')),
  climate TEXT NOT NULL,
  description TEXT NOT NULL,
  key_grapes TEXT NOT NULL,
  wine_styles TEXT NOT NULL,
  notable_appellations TEXT,
  classification_system TEXT,
  characteristics TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can read regions" ON regions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert regions" ON regions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update regions" ON regions FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete regions" ON regions FOR DELETE TO authenticated USING (true);

-- Indexes
CREATE INDEX idx_regions_country ON regions(country);
CREATE INDEX idx_regions_parent ON regions(parent_region);
CREATE INDEX idx_regions_type ON regions(region_type);
CREATE INDEX idx_regions_display_order ON regions(display_order);

-- Update trigger
CREATE OR REPLACE FUNCTION update_regions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER regions_updated_at
  BEFORE UPDATE ON regions
  FOR EACH ROW
  EXECUTE FUNCTION update_regions_updated_at();
