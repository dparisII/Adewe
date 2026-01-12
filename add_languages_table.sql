-- Create languages table for Content Tab

CREATE TABLE IF NOT EXISTS languages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  native_name TEXT,
  flag TEXT DEFAULT '🏳️',
  script TEXT DEFAULT 'latin',
  is_active BOOLEAN DEFAULT TRUE,
  is_target BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read languages
DROP POLICY IF EXISTS "Anyone can view languages" ON languages;
CREATE POLICY "Anyone can view languages" ON languages FOR SELECT USING (true);

-- Allow admins to manage languages
DROP POLICY IF EXISTS "Admins can manage languages" ON languages;
CREATE POLICY "Admins can manage languages" ON languages FOR ALL USING (is_admin());

-- Seed the 6 core languages
INSERT INTO languages (code, name, native_name, flag, script, is_active, is_target, sort_order)
VALUES
  ('am', 'Amharic', 'አማርኛ', '🇪🇹', 'geez', true, true, 1),
  -- ('ti', 'Tigrinya', 'ትግርኛ', '🇪🇷', 'geez', true, true, 2),
  ('ti', 'Tigrinya', 'ትግርኛ', '🇪🇹', 'geez', true, true, 2),
  ('om', 'Oromo', 'Afaan Oromoo', '🇪🇹', 'latin', true, true, 3),
  -- ('so', 'Somali', 'Soomaali', '🇸🇴', 'latin', true, true, 4),
  ('so', 'Somali', 'Soomaali', '🇪🇹', 'latin', true, true, 4),
  ('en', 'English', 'English', '🇬🇧', 'latin', true, true, 5),
  ('gez', 'Ge''ez', 'ግዕዝ', '🇪🇹', 'geez', true, true, 6)
ON CONFLICT (code) DO NOTHING;

-- Add font_family column to branding_settings
ALTER TABLE branding_settings ADD COLUMN IF NOT EXISTS font_family TEXT DEFAULT 'Nunito';
