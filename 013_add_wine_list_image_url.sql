-- Add wine_list_image_url column to menu_pairings table
ALTER TABLE menu_pairings
ADD COLUMN IF NOT EXISTS wine_list_image_url TEXT;
