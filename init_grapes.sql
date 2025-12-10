-- First, check if you need to create the table
-- Run this in your Supabase SQL editor

-- Create grapes table
CREATE TABLE IF NOT EXISTS grapes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  alternative_names TEXT[],
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

-- Enable RLS
ALTER TABLE grapes ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can read grapes" ON grapes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert grapes" ON grapes FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update grapes" ON grapes FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete grapes" ON grapes FOR DELETE TO authenticated USING (true);
