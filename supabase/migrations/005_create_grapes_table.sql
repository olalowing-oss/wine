-- Create grapes table for the grape guide
CREATE TABLE IF NOT EXISTS grapes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  alternative_names TEXT[], -- Array of alternative names
  color TEXT NOT NULL CHECK (color IN ('red', 'white')),
  style TEXT NOT NULL,
  aromas TEXT NOT NULL,
  origin TEXT NOT NULL,
  styles TEXT NOT NULL,
  aging TEXT NOT NULL,
  food_pairing TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on color for filtering
CREATE INDEX idx_grapes_color ON grapes(color);

-- Create index on display_order for sorting
CREATE INDEX idx_grapes_display_order ON grapes(display_order);

-- Enable RLS
ALTER TABLE grapes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read grapes (public information)
CREATE POLICY "Anyone can read grapes"
  ON grapes
  FOR SELECT
  USING (true);

-- For now, allow all authenticated users to manage grapes
-- Later you can restrict this to admin users only
CREATE POLICY "Authenticated users can insert grapes"
  ON grapes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update grapes"
  ON grapes
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete grapes"
  ON grapes
  FOR DELETE
  TO authenticated
  USING (true);

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_grapes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_grapes_updated_at
  BEFORE UPDATE ON grapes
  FOR EACH ROW
  EXECUTE FUNCTION update_grapes_updated_at();
