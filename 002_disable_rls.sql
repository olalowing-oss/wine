-- Disable Row Level Security to allow access without authentication
ALTER TABLE wines DISABLE ROW LEVEL SECURITY;
ALTER TABLE menu_pairings DISABLE ROW LEVEL SECURITY;

-- Drop all RLS policies for wines
DROP POLICY IF EXISTS "Users can view their own wines" ON wines;
DROP POLICY IF EXISTS "Users can insert their own wines" ON wines;
DROP POLICY IF EXISTS "Users can update their own wines" ON wines;
DROP POLICY IF EXISTS "Users can delete their own wines" ON wines;

-- Drop all RLS policies for menu_pairings
DROP POLICY IF EXISTS "Users can view their own menu pairings" ON menu_pairings;
DROP POLICY IF EXISTS "Users can insert their own menu pairings" ON menu_pairings;
DROP POLICY IF EXISTS "Users can update their own menu pairings" ON menu_pairings;
DROP POLICY IF EXISTS "Users can delete their own menu pairings" ON menu_pairings;

-- Drop all storage policies
DROP POLICY IF EXISTS "Users can upload wine images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view wine images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their wine images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their wine images" ON storage.objects;

-- Create new public storage policies
CREATE POLICY "Anyone can upload wine images"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'wine-images');

CREATE POLICY "Anyone can view wine images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'wine-images');

CREATE POLICY "Anyone can update wine images"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'wine-images');

CREATE POLICY "Anyone can delete wine images"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'wine-images');

-- Make user_id nullable since we're not using authentication
ALTER TABLE wines ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE menu_pairings ALTER COLUMN user_id DROP NOT NULL;
