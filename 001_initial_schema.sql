-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create wines table
CREATE TABLE IF NOT EXISTS wines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    vecka INTEGER NOT NULL,
    vin_namn TEXT NOT NULL,
    typ TEXT NOT NULL,
    datum_tillagd TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    producent TEXT DEFAULT '',
    ursprung TEXT DEFAULT '',
    druva TEXT DEFAULT '',
    taggar TEXT DEFAULT '',
    pris DECIMAL(10, 2),
    betyg DECIMAL(2, 1),
    systembolaget_nr TEXT,
    serv_temperatur TEXT,
    systembolaget_lank TEXT,
    plats TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    adress TEXT,
    beskrivning TEXT,
    smakanteckningar TEXT,
    servering_info TEXT,
    ovrigt TEXT,
    ar_hemma BOOLEAN DEFAULT FALSE,
    ai_recommendations TEXT,
    recommendation_date TIMESTAMP WITH TIME ZONE,
    user_image_url_1 TEXT,
    user_image_url_2 TEXT,
    user_image_url_3 TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create menu_pairings table
CREATE TABLE IF NOT EXISTS menu_pairings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    restaurant_name TEXT NOT NULL,
    menu_image_url TEXT,
    menu_text TEXT,
    analysis_result JSONB,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_wines_user_id ON wines(user_id);
CREATE INDEX idx_wines_typ ON wines(typ);
CREATE INDEX idx_wines_ar_hemma ON wines(ar_hemma);
CREATE INDEX idx_wines_datum_tillagd ON wines(datum_tillagd DESC);
CREATE INDEX idx_menu_pairings_user_id ON menu_pairings(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE wines ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_pairings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for wines
CREATE POLICY "Users can view their own wines"
    ON wines FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wines"
    ON wines FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wines"
    ON wines FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wines"
    ON wines FOR DELETE
    USING (auth.uid() = user_id);

-- Create RLS policies for menu_pairings
CREATE POLICY "Users can view their own menu pairings"
    ON menu_pairings FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own menu pairings"
    ON menu_pairings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own menu pairings"
    ON menu_pairings FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own menu pairings"
    ON menu_pairings FOR DELETE
    USING (auth.uid() = user_id);

-- Create storage bucket for wine images
INSERT INTO storage.buckets (id, name, public)
VALUES ('wine-images', 'wine-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Users can upload wine images"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'wine-images' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Anyone can view wine images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'wine-images');

CREATE POLICY "Users can update their wine images"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'wine-images' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete their wine images"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'wine-images' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_wines_updated_at
    BEFORE UPDATE ON wines
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_pairings_updated_at
    BEFORE UPDATE ON menu_pairings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
