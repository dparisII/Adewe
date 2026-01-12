-- Fix Branding Persistence Issues

-- 1. Ensure table exists with correct schema
CREATE TABLE IF NOT EXISTS branding_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  site_name TEXT DEFAULT 'Adewe',
  tagline TEXT DEFAULT 'Learn Ethiopian Languages',
  primary_color TEXT DEFAULT '#58cc02',
  secondary_color TEXT DEFAULT '#1cb0f6',
  accent_color TEXT DEFAULT '#ff9600',
  logo_url TEXT,
  favicon_url TEXT,
  header_links JSONB DEFAULT '[]',
  footer_links JSONB DEFAULT '[]',
  social_links JSONB DEFAULT '{}',
  copyright TEXT DEFAULT '© 2026 Adewe. Made with ❤️ for Ethiopian languages',
  seo_title TEXT DEFAULT 'Adewe - Learn Ethiopian Languages',
  seo_description TEXT DEFAULT 'Interactive platform to learn Amharic, Tigrinya, Oromo, Somali and more',
  seo_keywords TEXT DEFAULT 'ethiopian languages, learn amharic, tigrinya, oromo, somali',
  logo_max_height INTEGER DEFAULT 40,
  show_partners BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Ensure missing columns exist in case the table was created by an older script
ALTER TABLE branding_settings ADD COLUMN IF NOT EXISTS logo_max_height INTEGER DEFAULT 40;
ALTER TABLE branding_settings ADD COLUMN IF NOT EXISTS show_partners BOOLEAN DEFAULT TRUE;
ALTER TABLE branding_settings ADD COLUMN IF NOT EXISTS font_family TEXT DEFAULT 'Nunito';
ALTER TABLE branding_settings ADD COLUMN IF NOT EXISTS show_legal_links BOOLEAN DEFAULT TRUE;

-- Handle footer_links type if it's JSONB but we're sending text (or vice versa)
-- To be safe, we'll allow it to be TEXT if it already is, or keep JSONB.
-- If the error persists, we might need to cast it in the JS code.

-- 2. Insert default row if missing (Critical for fetching)
INSERT INTO branding_settings (id, site_name) 
VALUES ('00000000-0000-0000-0000-000000000001', 'Adewe')
ON CONFLICT (id) DO NOTHING;

-- 3. Fix RLS Policies (Update & Insert)
ALTER TABLE branding_settings ENABLE ROW LEVEL SECURITY;

-- Drop old restricted policies
DROP POLICY IF EXISTS "Anyone can view branding" ON branding_settings;
DROP POLICY IF EXISTS "Admins can update branding" ON branding_settings;
DROP POLICY IF EXISTS "Admins can insert branding" ON branding_settings;

-- Create new permissive policies
-- Read: Everyone
CREATE POLICY "Anyone can view branding" ON branding_settings 
  FOR SELECT USING (true);

-- Update: Admins ONLY
CREATE POLICY "Admins can update branding" ON branding_settings 
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

-- Insert: Admins ONLY (Need this for upsert to work initially if deleted)
CREATE POLICY "Admins can insert branding" ON branding_settings 
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

-- 4. Verify triggers
DROP TRIGGER IF EXISTS update_branding_settings_updated_at ON branding_settings;
CREATE TRIGGER update_branding_settings_updated_at 
  BEFORE UPDATE ON branding_settings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 5. Grant permissions if needed (usually handled by RLS but good for roles)
GRANT ALL ON branding_settings TO postgres;
GRANT ALL ON branding_settings TO service_role;
GRANT SELECT, INSERT, UPDATE ON branding_settings TO authenticated;
GRANT SELECT ON branding_settings TO anon;
