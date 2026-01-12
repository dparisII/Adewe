-- ============================================
-- POLYGLOT ETHIOPIA - COMPLETE DATABASE SETUP
-- ============================================
-- Run this ENTIRE script in Supabase SQL Editor
-- Go to: https://supabase.com/dashboard/project/zjxffkulsznxkjxvmxrk/sql/new
-- ============================================

-- Step 1: Clean up existing tables and functions
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_profile_updated ON profiles;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_updated_at();
DROP TABLE IF EXISTS user_progress CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Step 2: Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  avatar_url TEXT,
  xp INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  hearts INTEGER DEFAULT 5,
  gems INTEGER DEFAULT 100,
  native_language TEXT DEFAULT 'english',
  learning_language TEXT,
  completed_lessons TEXT[] DEFAULT '{}',
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Step 3: Create lessons table
CREATE TABLE lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  language TEXT NOT NULL,
  level INTEGER DEFAULT 1,
  title TEXT NOT NULL,
  description TEXT,
  xp_reward INTEGER DEFAULT 10,
  content JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Step 4: Create user_progress table
CREATE TABLE user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  score INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, lesson_id)
);

-- Step 5: Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Step 6: Create RLS Policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Step 7: Create RLS Policies for lessons (public read)
CREATE POLICY "Anyone can view lessons"
  ON lessons FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage lessons"
  ON lessons FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Step 8: Create RLS Policies for user_progress
CREATE POLICY "Users can view their own progress"
  ON user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON user_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Step 9: Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email, phone, is_admin)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    CASE WHEN NEW.email = 'hi@tech.com' THEN TRUE ELSE FALSE END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 10: Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 11: Create triggers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Step 12: Insert sample lessons for each language
INSERT INTO lessons (language, level, title, description, xp_reward, content) VALUES
-- Amharic Lessons
('amharic', 1, 'Greetings', 'Learn basic Amharic greetings', 10, '{"words": [{"word": "ሰላም", "translation": "Hello", "pronunciation": "selam"}, {"word": "እንደምን", "translation": "How are you?", "pronunciation": "endemin"}]}'),
('amharic', 1, 'Numbers 1-10', 'Learn to count in Amharic', 10, '{"words": [{"word": "አንድ", "translation": "One", "pronunciation": "and"}, {"word": "ሁለት", "translation": "Two", "pronunciation": "hulet"}]}'),
('amharic', 2, 'Family', 'Learn family words in Amharic', 15, '{"words": [{"word": "እናት", "translation": "Mother", "pronunciation": "enat"}, {"word": "አባት", "translation": "Father", "pronunciation": "abat"}]}'),

-- Tigrinya Lessons
('tigrinya', 1, 'Greetings', 'Learn basic Tigrinya greetings', 10, '{"words": [{"word": "ሰላም", "translation": "Hello", "pronunciation": "selam"}, {"word": "ከመይ ኣለኻ", "translation": "How are you?", "pronunciation": "kemey aleka"}]}'),
('tigrinya', 1, 'Numbers 1-10', 'Learn to count in Tigrinya', 10, '{"words": [{"word": "ሓደ", "translation": "One", "pronunciation": "hade"}, {"word": "ክልተ", "translation": "Two", "pronunciation": "kilte"}]}'),

-- Afaan Oromo Lessons
('oromo', 1, 'Greetings', 'Learn basic Oromo greetings', 10, '{"words": [{"word": "Akkam", "translation": "Hello", "pronunciation": "akkam"}, {"word": "Nagaa", "translation": "Peace", "pronunciation": "nagaa"}]}'),
('oromo', 1, 'Numbers 1-10', 'Learn to count in Oromo', 10, '{"words": [{"word": "Tokko", "translation": "One", "pronunciation": "tokko"}, {"word": "Lama", "translation": "Two", "pronunciation": "lama"}]}'),

-- Somali Lessons
('somali', 1, 'Greetings', 'Learn basic Somali greetings', 10, '{"words": [{"word": "Salaan", "translation": "Hello", "pronunciation": "salaan"}, {"word": "Sidee tahay", "translation": "How are you?", "pronunciation": "sidee tahay"}]}'),
('somali', 1, 'Numbers 1-10', 'Learn to count in Somali', 10, '{"words": [{"word": "Kow", "translation": "One", "pronunciation": "kow"}, {"word": "Laba", "translation": "Two", "pronunciation": "laba"}]}'),

-- English Lessons (for non-English speakers)
('english', 1, 'Greetings', 'Learn basic English greetings', 10, '{"words": [{"word": "Hello", "translation": "ሰላም", "pronunciation": "heh-loh"}, {"word": "Goodbye", "translation": "ደህና ሁን", "pronunciation": "good-bye"}]}'),
('english', 1, 'Numbers 1-10', 'Learn to count in English', 10, '{"words": [{"word": "One", "translation": "አንድ", "pronunciation": "wun"}, {"word": "Two", "translation": "ሁለት", "pronunciation": "too"}]}');

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- 
-- Next Steps:
-- 1. Go to Authentication > Users > Add user
-- 2. Create admin: hi@tech.com / hitech@4321
-- 3. Check "Auto Confirm User" checkbox
-- 4. Click "Create user"
--
-- Optional: Disable email confirmation for testing
-- Go to Authentication > Providers > Email
-- Turn OFF "Confirm email"
-- ============================================
-- ============================================
-- ADEWE - SUPER ADMIN DATABASE SCHEMA
-- ============================================
-- Run this in Supabase SQL Editor after the main schema
-- ============================================

-- ============================================
-- 1. BRANDING SETTINGS TABLE
-- ============================================
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Insert default branding
INSERT INTO branding_settings (id, site_name) 
VALUES ('00000000-0000-0000-0000-000000000001', 'Adewe')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. LEGAL DOCUMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS legal_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL UNIQUE, -- privacy_policy, terms_of_use, disclaimer, cookies_policy, gdpr
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  version INTEGER DEFAULT 1,
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Insert default legal documents
INSERT INTO legal_documents (type, title, content) VALUES
  ('privacy_policy', 'Privacy Policy', '<h1>Privacy Policy</h1><p>Your privacy is important to us...</p>'),
  ('terms_of_use', 'Terms of Use', '<h1>Terms of Use</h1><p>By using Adewe, you agree to...</p>'),
  ('disclaimer', 'Disclaimer', '<h1>Disclaimer</h1><p>The content provided is for educational purposes...</p>'),
  ('cookies_policy', 'Cookies Policy', '<h1>Cookies Policy</h1><p>We use cookies to improve your experience...</p>')
ON CONFLICT (type) DO NOTHING;

-- ============================================
-- 3. LANGUAGES TABLE (Enhanced)
-- ============================================
CREATE TABLE IF NOT EXISTS languages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL, -- am, ti, om, so, en
  name TEXT NOT NULL, -- Amharic, Tigrinya, etc.
  native_name TEXT, -- አማርኛ, ትግርኛ, etc.
  flag TEXT, -- emoji or URL
  script TEXT DEFAULT 'latin', -- geez, latin, arabic
  direction TEXT DEFAULT 'ltr', -- ltr, rtl
  is_active BOOLEAN DEFAULT TRUE,
  is_source BOOLEAN DEFAULT FALSE, -- can be used as source language
  is_target BOOLEAN DEFAULT TRUE, -- can be learned
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Insert default languages
INSERT INTO languages (code, name, native_name, flag, script, is_source, is_target, sort_order) VALUES
  ('en', 'English', 'English', '🇺🇸', 'latin', TRUE, FALSE, 0),
  ('am', 'Amharic', 'አማርኛ', '🇪🇹', 'geez', TRUE, TRUE, 1),
  ('ti', 'Tigrinya', 'ትግርኛ', '🇪🇷', 'geez', FALSE, TRUE, 2),
  ('om', 'Afaan Oromo', 'Afaan Oromoo', '🇪🇹', 'latin', FALSE, TRUE, 3),
  ('so', 'Somali', 'Soomaali', '🇸🇴', 'latin', FALSE, TRUE, 4)
ON CONFLICT (code) DO NOTHING;

-- ============================================
-- 4. SECTIONS TABLE
-- ============================================
-- Drop to ensure correct schema (with language_id UUID) is created
DROP TABLE IF EXISTS units CASCADE;
DROP TABLE IF EXISTS sections CASCADE;

CREATE TABLE IF NOT EXISTS sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  language_id UUID REFERENCES languages(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- 5. UNITS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS units (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_id UUID REFERENCES sections(id) ON DELETE CASCADE,
  language_id UUID REFERENCES languages(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  icon TEXT, -- emoji or icon name
  color TEXT DEFAULT '#58cc02',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- 5. LESSONS TABLE (Enhanced)
-- ============================================
-- Note: We already have a lessons table, so we'll add columns if needed
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS unit_id UUID REFERENCES units(id) ON DELETE CASCADE;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS difficulty TEXT DEFAULT 'beginner'; -- beginner, intermediate, advanced
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS estimated_time INTEGER DEFAULT 5; -- minutes
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS icon TEXT;

-- ============================================
-- 6. EXERCISES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- translation, multiple_choice, fill_blank, matching, listening, speaking
  question TEXT NOT NULL,
  correct_answer TEXT,
  options JSONB DEFAULT '[]', -- for multiple choice
  pairs JSONB DEFAULT '[]', -- for matching
  sentence TEXT, -- for fill_blank
  hint TEXT,
  explanation TEXT,
  audio_url TEXT,
  image_url TEXT,
  difficulty INTEGER DEFAULT 1, -- 1-5
  xp_reward INTEGER DEFAULT 10,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- 7. AUDIO FILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS audio_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  language_code TEXT REFERENCES languages(code) ON DELETE CASCADE,
  text TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  duration_ms INTEGER,
  voice_type TEXT DEFAULT 'tts', -- tts, human, hasab_ai
  speaker TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- 8. PAYMENT SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS payment_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider TEXT NOT NULL, -- stripe, chapa, paypal
  is_enabled BOOLEAN DEFAULT FALSE,
  api_key_encrypted TEXT,
  webhook_secret_encrypted TEXT,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- 9. SUBSCRIPTION TIERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS subscription_tiers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price_monthly DECIMAL(10,2) DEFAULT 0,
  price_yearly DECIMAL(10,2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  features JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Insert default tiers
INSERT INTO subscription_tiers (name, description, price_monthly, price_yearly, features, sort_order) VALUES
  ('Free', 'Basic access to lessons', 0, 0, '["5 hearts per day", "Basic lessons", "Limited languages"]', 0),
  ('Premium', 'Full access to all content', 9.99, 79.99, '["Unlimited hearts", "All lessons", "All languages", "Offline mode", "No ads"]', 1),
  ('Family', 'Share with up to 6 members', 14.99, 119.99, '["Everything in Premium", "6 family members", "Family progress tracking"]', 2)
ON CONFLICT DO NOTHING;

-- ============================================
-- 10. USER SUBSCRIPTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  tier_id UUID REFERENCES subscription_tiers(id),
  status TEXT DEFAULT 'active', -- active, cancelled, expired, trial
  payment_provider TEXT,
  external_subscription_id TEXT,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- 11. PAYMENT TRANSACTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  subscription_id UUID REFERENCES user_subscriptions(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending', -- pending, completed, failed, refunded
  payment_provider TEXT,
  external_transaction_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- 12. API USAGE TRACKING TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS api_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service TEXT NOT NULL, -- hasab_ai_tts, hasab_ai_stt, hasab_ai_translate
  endpoint TEXT,
  request_count INTEGER DEFAULT 1,
  tokens_used INTEGER DEFAULT 0,
  cost DECIMAL(10,4) DEFAULT 0,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- 13. HASAB AI SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS hasab_ai_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  api_key_encrypted TEXT,
  is_enabled BOOLEAN DEFAULT FALSE,
  tts_enabled BOOLEAN DEFAULT TRUE,
  stt_enabled BOOLEAN DEFAULT TRUE,
  translate_enabled BOOLEAN DEFAULT TRUE,
  monthly_budget DECIMAL(10,2) DEFAULT 100,
  current_month_usage DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Insert default settings
INSERT INTO hasab_ai_settings (id) 
VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 14. ANALYTICS EVENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL, -- lesson_started, lesson_completed, exercise_completed, login, signup
  event_data JSONB DEFAULT '{}',
  device_type TEXT, -- mobile, desktop, tablet
  browser TEXT,
  country TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index for analytics queries
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user ON analytics_events(user_id);

-- ============================================
-- 15. PROMO CODES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS promo_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT DEFAULT 'percentage', -- percentage, fixed
  discount_value DECIMAL(10,2) NOT NULL,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE,
  applicable_tiers UUID[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- 16. LOCAL PAYMENT SETTINGS (Bank Transfer)
-- ============================================
CREATE TABLE IF NOT EXISTS local_payment_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  is_enabled BOOLEAN DEFAULT TRUE,
  bank_name TEXT NOT NULL,
  account_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  instructions TEXT DEFAULT 'Please transfer the exact amount and include your email in the reference.',
  currency TEXT DEFAULT 'ETB',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Insert default local payment settings
INSERT INTO local_payment_settings (id, bank_name, account_name, account_number, instructions) 
VALUES (
  '00000000-0000-0000-0000-000000000001', 
  'Commercial Bank of Ethiopia',
  'Adewe Language Learning',
  '1000123456789',
  'Transfer the exact amount and send us your transaction reference number (FT/Invoice No) for verification.'
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 17. LOCAL PAYMENT REQUESTS (User submissions)
-- ============================================
CREATE TABLE IF NOT EXISTS local_payment_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  tier_id UUID REFERENCES subscription_tiers(id),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'ETB',
  transaction_reference TEXT NOT NULL, -- FT number or invoice number
  bank_name TEXT,
  payer_name TEXT,
  payer_phone TEXT,
  screenshot_url TEXT,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  admin_notes TEXT,
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- RLS POLICIES FOR NEW TABLES
-- ============================================

-- Branding settings - public read, admin write
ALTER TABLE branding_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view branding" ON branding_settings;
CREATE POLICY "Anyone can view branding" ON branding_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can update branding" ON branding_settings;
CREATE POLICY "Admins can update branding" ON branding_settings FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- Legal documents - public read, admin write
ALTER TABLE legal_documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view published legal docs" ON legal_documents;
CREATE POLICY "Anyone can view published legal docs" ON legal_documents FOR SELECT USING (is_published = TRUE);
DROP POLICY IF EXISTS "Admins can manage legal docs" ON legal_documents;
CREATE POLICY "Admins can manage legal docs" ON legal_documents FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- Languages - public read, admin write
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view active languages" ON languages;
CREATE POLICY "Anyone can view active languages" ON languages FOR SELECT USING (is_active = TRUE);
DROP POLICY IF EXISTS "Admins can manage languages" ON languages;
CREATE POLICY "Admins can manage languages" ON languages FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- Sections - public read, admin write
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view published sections" ON sections;
CREATE POLICY "Anyone can view published sections" ON sections FOR SELECT USING (is_published = TRUE);
DROP POLICY IF EXISTS "Admins can manage sections" ON sections;
CREATE POLICY "Admins can manage sections" ON sections FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- Units - public read, admin write
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view published units" ON units;
CREATE POLICY "Anyone can view published units" ON units FOR SELECT USING (is_published = TRUE);
DROP POLICY IF EXISTS "Admins can manage units" ON units;
CREATE POLICY "Admins can manage units" ON units FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- Exercises - public read, admin write
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view published exercises" ON exercises;
CREATE POLICY "Anyone can view published exercises" ON exercises FOR SELECT USING (is_published = TRUE);
DROP POLICY IF EXISTS "Admins can manage exercises" ON exercises;
CREATE POLICY "Admins can manage exercises" ON exercises FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- Audio files - public read, admin write
ALTER TABLE audio_files ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view audio files" ON audio_files;
CREATE POLICY "Anyone can view audio files" ON audio_files FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage audio files" ON audio_files;
CREATE POLICY "Admins can manage audio files" ON audio_files FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- Subscription tiers - public read
ALTER TABLE subscription_tiers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view active tiers" ON subscription_tiers;
CREATE POLICY "Anyone can view active tiers" ON subscription_tiers FOR SELECT USING (is_active = TRUE);
DROP POLICY IF EXISTS "Admins can manage tiers" ON subscription_tiers;
CREATE POLICY "Admins can manage tiers" ON subscription_tiers FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- User subscriptions - users see own, admins see all
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own subscription" ON user_subscriptions;
CREATE POLICY "Users can view own subscription" ON user_subscriptions FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can manage subscriptions" ON user_subscriptions;
CREATE POLICY "Admins can manage subscriptions" ON user_subscriptions FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- Payment transactions - users see own, admins see all
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own transactions" ON payment_transactions;
CREATE POLICY "Users can view own transactions" ON payment_transactions FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can view all transactions" ON payment_transactions;
CREATE POLICY "Admins can view all transactions" ON payment_transactions FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- Analytics - admin only
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can view analytics" ON analytics_events;
CREATE POLICY "Admins can view analytics" ON analytics_events FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);
DROP POLICY IF EXISTS "System can insert analytics" ON analytics_events;
CREATE POLICY "System can insert analytics" ON analytics_events FOR INSERT WITH CHECK (true);

-- API usage - admin only
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can view api usage" ON api_usage;
CREATE POLICY "Admins can view api usage" ON api_usage FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- Hasab AI settings - admin only
ALTER TABLE hasab_ai_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage hasab ai settings" ON hasab_ai_settings;
CREATE POLICY "Admins can manage hasab ai settings" ON hasab_ai_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- Payment settings - admin only
ALTER TABLE payment_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage payment settings" ON payment_settings;
CREATE POLICY "Admins can manage payment settings" ON payment_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- Promo codes - admin only
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage promo codes" ON promo_codes;
CREATE POLICY "Admins can manage promo codes" ON promo_codes FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- Local payment settings - public read, admin write
ALTER TABLE local_payment_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view local payment settings" ON local_payment_settings;
CREATE POLICY "Anyone can view local payment settings" ON local_payment_settings FOR SELECT USING (is_enabled = TRUE);
DROP POLICY IF EXISTS "Admins can manage local payment settings" ON local_payment_settings;
CREATE POLICY "Admins can manage local payment settings" ON local_payment_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- Local payment requests - users see own, admins see all
ALTER TABLE local_payment_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own payment requests" ON local_payment_requests;
CREATE POLICY "Users can view own payment requests" ON local_payment_requests FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can create payment requests" ON local_payment_requests;
CREATE POLICY "Users can create payment requests" ON local_payment_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can manage all payment requests" ON local_payment_requests;
CREATE POLICY "Admins can manage all payment requests" ON local_payment_requests FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- ============================================
-- UPDATE TRIGGERS
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to all tables with updated_at
DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN 
    SELECT unnest(ARRAY['branding_settings', 'legal_documents', 'languages', 'units', 'exercises', 'user_subscriptions', 'hasab_ai_settings', 'payment_settings'])
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS update_%s_updated_at ON %s', t, t);
    EXECUTE format('CREATE TRIGGER update_%s_updated_at BEFORE UPDATE ON %s FOR EACH ROW EXECUTE FUNCTION update_updated_at()', t, t);
  END LOOP;
END;
$$;

-- ============================================
-- DONE!
-- ============================================
-- Run this SQL in Supabase SQL Editor
-- Then refresh your app
-- ============================================
-- Analytics Table
CREATE TABLE IF NOT EXISTS site_visits (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  visitor_id TEXT, -- Simple fingerprint or random id
  page_path TEXT
);

-- Community Tables
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  auto_post_type TEXT, -- 'first_lesson', 'milestone_50xp', etc.
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS post_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

CREATE TABLE IF NOT EXISTS post_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_visits ENABLE ROW LEVEL SECURITY;

-- Policies for Community
DROP POLICY IF EXISTS "Public profiles can view all posts" ON community_posts;
CREATE POLICY "Public profiles can view all posts" ON community_posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can create posts" ON community_posts;
CREATE POLICY "Authenticated users can create posts" ON community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can edit their own posts" ON community_posts;
CREATE POLICY "Users can edit their own posts" ON community_posts FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own posts" ON community_posts;
CREATE POLICY "Users can delete their own posts" ON community_posts FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Public profiles can view all likes" ON post_likes;
CREATE POLICY "Public profiles can view all likes" ON post_likes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can like posts" ON post_likes;
CREATE POLICY "Authenticated users can like posts" ON post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can unlike their own likes" ON post_likes;
CREATE POLICY "Users can unlike their own likes" ON post_likes FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Public profiles can view all comments" ON post_comments;
CREATE POLICY "Public profiles can view all comments" ON post_comments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can comment" ON post_comments;
CREATE POLICY "Authenticated users can comment" ON post_comments FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can edit their own comments" ON post_comments;
CREATE POLICY "Users can edit their own comments" ON post_comments FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own comments" ON post_comments;
CREATE POLICY "Users can delete their own comments" ON post_comments FOR DELETE USING (auth.uid() = user_id);

-- Policies for Analytics
DROP POLICY IF EXISTS "Anyone can insert a visit" ON site_visits;
CREATE POLICY "Anyone can insert a visit" ON site_visits FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view site visits" ON site_visits;
CREATE POLICY "Admins can view site visits" ON site_visits FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  )
);

-- Followers Table
CREATE TABLE IF NOT EXISTS user_follows (
  follower_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  followed_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (follower_id, followed_id)
);

ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can see follows" ON user_follows;
CREATE POLICY "Anyone can see follows" ON user_follows FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can follow" ON user_follows;
CREATE POLICY "Authenticated users can follow" ON user_follows FOR INSERT WITH CHECK (auth.uid() = follower_id);

DROP POLICY IF EXISTS "Users can unfollow" ON user_follows;
CREATE POLICY "Users can unfollow" ON user_follows FOR DELETE USING (auth.uid() = follower_id);

-- (Removed duplicate Legal Documents Table)

-- App Settings (Community Triggers)
CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed initial settings
INSERT INTO app_settings (key, value) VALUES 
('community_auto_posts', '{
  "first_lesson": {"enabled": true, "xp": 10, "message": "just completed their first lesson! 🎓"},
  "milestone_50xp": {"enabled": true, "xp": 50, "message": "reached the 50 XP milestone! ⚡"},
  "new_friend": {"enabled": true, "message": "just made a new friend! 🤝"},
  "new_language": {"enabled": true, "message": "started learning a new language! 🌍"}
}')
ON CONFLICT (key) DO NOTHING;

ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view app settings" ON app_settings;
CREATE POLICY "Anyone can view app settings" ON app_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage app settings" ON app_settings;
CREATE POLICY "Admins can manage app settings" ON app_settings FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  )
);
-- Add league_id and bio to profiles if not exist
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'profiles' AND COLUMN_NAME = 'league_id') THEN
    ALTER TABLE profiles ADD COLUMN league_id INTEGER DEFAULT 1;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'profiles' AND COLUMN_NAME = 'bio') THEN
    ALTER TABLE profiles ADD COLUMN bio TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'profiles' AND COLUMN_NAME = 'language_progress') THEN
    ALTER TABLE profiles ADD COLUMN language_progress JSONB DEFAULT '[]'::jsonb;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'profiles' AND COLUMN_NAME = 'phone_number') THEN
    ALTER TABLE profiles ADD COLUMN phone_number TEXT;
  END IF;
END $$;

-- Leagues Table
CREATE TABLE IF NOT EXISTS leagues (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  xp_required INTEGER DEFAULT 0,
  promote_top INTEGER DEFAULT 10,
  demote_bottom INTEGER DEFAULT 5
);

-- Seed Leagues
INSERT INTO leagues (id, name, icon, xp_required, promote_top, demote_bottom) VALUES
(1, 'Bronze', '🥉', 0, 10, 0),
(2, 'Silver', '🥈', 100, 10, 5),
(3, 'Gold', '🥇', 500, 10, 5),
(4, 'Sapphire', '💎', 1000, 10, 5),
(5, 'Ruby', '🧣', 2000, 10, 5),
(6, 'Emerald', '🔋', 4000, 10, 5),
(7, 'Amethyst', '🔮', 7000, 10, 5),
(8, 'Pearl', '⚪', 10000, 5, 5),
(9, 'Obsidian', '⬛', 15000, 5, 5),
(10, 'Diamond', '💠', 25000, 0, 5)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  icon = EXCLUDED.icon,
  promote_top = EXCLUDED.promote_top,
  demote_bottom = EXCLUDED.demote_bottom;

-- Shop Items Table
CREATE TABLE IF NOT EXISTS shop_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE, -- Added slug for consistent referencing
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  icon TEXT,
  category TEXT, -- 'hearts', 'gems', 'power-ups', 'cosmetics', 'upgrades', 'special'
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Safely add slug column if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'shop_items' AND COLUMN_NAME = 'slug') THEN
    ALTER TABLE shop_items ADD COLUMN slug TEXT UNIQUE;
  END IF;
END $$;

ALTER TABLE shop_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view available shop items" ON shop_items;
CREATE POLICY "Anyone can view available shop items" ON shop_items FOR SELECT USING (is_available = true);

DROP POLICY IF EXISTS "Admins can manage shop items" ON shop_items;
CREATE POLICY "Admins can manage shop items" ON shop_items FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  )
);

-- Seed Initial Shop Items
INSERT INTO shop_items (slug, name, description, price, icon, category) VALUES
('refill_hearts', 'Refill Hearts', 'Instantly refill all your hearts', 350, '❤️', 'power-ups'),
('streak_freeze', 'Streak Freeze', 'Protect your streak for one day of inactivity.', 200, '🧊', 'power-ups'),
('double_xp', 'Double XP', 'Earn 2x XP for 15 minutes', 500, '⚡', 'power-ups'),
('unlimited_hearts', 'Unlimited Hearts', 'Unlimited hearts for 1 hour', 800, '💖', 'power-ups'),
('xp_boost', 'XP Boost', '+50 XP bonus', 150, '🌟', 'power-ups'),
('gem_boost', 'Gem Boost', '+20 gems bonus', 100, '💎', 'power-ups'),
('lesson_skip', 'Lesson Skip', 'Skip one lesson', 400, '⏭️', 'power-ups'),
('hint_pack', 'Hint Pack', '5 free hints', 250, '💡', 'power-ups'),
('time_freeze', 'Time Freeze', 'Pause timer for timed practice', 300, '⏸️', 'power-ups'),
('mistake_eraser', 'Mistake Eraser', 'Undo last mistake', 450, '↩️', 'power-ups'),
('red_hat', 'Red Hat', 'Stylish red hat for your owl', 500, '🎩', 'cosmetics'),
('blue_cap', 'Blue Cap', 'Cool blue cap', 500, '🧢', 'cosmetics'),
('smart_glasses', 'Smart Glasses', 'Look intelligent', 600, '👓', 'cosmetics'),
('royal_crown', 'Royal Crown', 'Rule the leaderboard', 1500, '👑', 'cosmetics'),
('forest_bg', 'Forest Background', 'Nature theme', 800, '🌲', 'cosmetics')
ON CONFLICT (slug) DO UPDATE SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  icon = EXCLUDED.icon,
  category = EXCLUDED.category;
-- Seed data for 10 sections and 15 units per language
-- Run this after the main schema is created

-- First, ensure languages exist
INSERT INTO languages (code, name, native_name, flag, is_active) VALUES
  ('english', 'English', 'English', '🇬🇧', true),
  ('amharic', 'Amharic', 'አማርኛ', '🇪🇹', true),
  ('tigrinya', 'Tigrinya', 'ትግርኛ', '🇪🇷', true),
  ('oromo', 'Afaan Oromo', 'Afaan Oromoo', '🇪🇹', true),
  ('somali', 'Somali', 'Soomaali', '🇸🇴', true)
ON CONFLICT (code) DO NOTHING;

-- Create sections for each language (10 sections each)
-- Section themes: Basics, Greetings, Family, Food, Numbers, Colors, Animals, Travel, Work, Culture

-- Function to create sections and units for a language
DO $$
DECLARE
  lang RECORD;
  section_id UUID;
  unit_id UUID;
  section_names TEXT[] := ARRAY[
    'Basics', 'Greetings', 'Family', 'Food & Drinks', 'Numbers',
    'Colors & Shapes', 'Animals', 'Travel', 'Work & School', 'Culture'
  ];
  section_descriptions TEXT[] := ARRAY[
    'Learn the fundamentals of the language',
    'Common greetings and introductions',
    'Family members and relationships',
    'Food, drinks, and dining',
    'Numbers and counting',
    'Colors, shapes, and descriptions',
    'Animals and nature',
    'Travel and directions',
    'Work, school, and daily life',
    'Culture, traditions, and customs'
  ];
  unit_names TEXT[][] := ARRAY[
    -- Basics units
    ARRAY['Hello World', 'Basic Phrases', 'Simple Words', 'Pronunciation', 'Writing Basics',
          'Common Expressions', 'Yes and No', 'Please and Thanks', 'Questions', 'Answers',
          'Basic Verbs', 'Basic Nouns', 'Adjectives', 'Adverbs', 'Review'],
    -- Greetings units
    ARRAY['Morning Greetings', 'Evening Greetings', 'Formal Hello', 'Casual Hello', 'Goodbye',
          'How Are You', 'Nice to Meet You', 'Introductions', 'Names', 'Titles',
          'Polite Forms', 'Informal Forms', 'Phone Greetings', 'Letter Greetings', 'Review'],
    -- Family units
    ARRAY['Parents', 'Siblings', 'Grandparents', 'Extended Family', 'In-Laws',
          'Children', 'Cousins', 'Family Events', 'Relationships', 'Home Life',
          'Family Activities', 'Generations', 'Family Tree', 'Traditions', 'Review'],
    -- Food units
    ARRAY['Fruits', 'Vegetables', 'Meat & Fish', 'Grains', 'Dairy',
          'Beverages', 'Breakfast', 'Lunch', 'Dinner', 'Snacks',
          'Cooking', 'Restaurant', 'Traditional Food', 'Recipes', 'Review'],
    -- Numbers units
    ARRAY['1 to 10', '11 to 20', '21 to 100', 'Hundreds', 'Thousands',
          'Ordinals', 'Fractions', 'Math Terms', 'Time', 'Dates',
          'Money', 'Measurements', 'Phone Numbers', 'Addresses', 'Review'],
    -- Colors units
    ARRAY['Primary Colors', 'Secondary Colors', 'Shades', 'Patterns', 'Shapes',
          'Sizes', 'Textures', 'Descriptions', 'Comparisons', 'Art Terms',
          'Nature Colors', 'Fashion Colors', 'Home Decor', 'Emotions', 'Review'],
    -- Animals units
    ARRAY['Pets', 'Farm Animals', 'Wild Animals', 'Birds', 'Fish',
          'Insects', 'Reptiles', 'Mammals', 'Animal Sounds', 'Habitats',
          'Endangered Species', 'Animal Actions', 'Zoo', 'Safari', 'Review'],
    -- Travel units
    ARRAY['Transportation', 'Airport', 'Hotel', 'Directions', 'Maps',
          'Landmarks', 'Tourism', 'Booking', 'Luggage', 'Customs',
          'Currency', 'Emergency', 'Local Transport', 'Sightseeing', 'Review'],
    -- Work units
    ARRAY['Professions', 'Office', 'Meetings', 'Email', 'Phone Calls',
          'School Subjects', 'Classroom', 'Homework', 'Exams', 'Graduation',
          'Job Interview', 'Salary', 'Colleagues', 'Projects', 'Review'],
    -- Culture units
    ARRAY['Holidays', 'Festivals', 'Music', 'Dance', 'Art',
          'Literature', 'History', 'Religion', 'Sports', 'Games',
          'Clothing', 'Ceremonies', 'Customs', 'Etiquette', 'Review']
  ];
  i INT;
  j INT;
BEGIN
  FOR lang IN SELECT id, code FROM languages WHERE is_active = true LOOP
    -- Create 10 sections for each language
    FOR i IN 1..10 LOOP
      INSERT INTO sections (language_id, name, description, order_index, is_published)
      VALUES (lang.id, section_names[i], section_descriptions[i], i, true)
      RETURNING id INTO section_id;
      
      -- Create 15 units for each section
      FOR j IN 1..15 LOOP
        INSERT INTO units (section_id, language_id, title, description, order_index, is_published)
        VALUES (
          section_id,
          lang.id,
          unit_names[i][j],
          'Learn about ' || lower(unit_names[i][j]),
          j,
          true
        );
      END LOOP;
    END LOOP;
  END LOOP;
END $$;

-- Create sample lessons for each unit (5 lessons per unit)
DO $$
DECLARE
  unit RECORD;
  lesson_types TEXT[] := ARRAY['vocabulary', 'grammar', 'listening', 'speaking', 'practice'];
BEGIN
  FOR unit IN 
    SELECT u.id, u.title, l.code as language_code 
    FROM units u 
    JOIN languages l ON u.language_id = l.id 
  LOOP
    FOR i IN 1..5 LOOP
      INSERT INTO lessons (unit_id, language, title, description, order_index, xp_reward, is_published)
      VALUES (
        unit.id,
        unit.language_code,
        lesson_types[i] || ' - ' || unit.title,
        'Practice ' || lesson_types[i] || ' skills',
        i,
        10,
        true
      );
    END LOOP;
  END LOOP;
END $$;

-- Verify the data
SELECT 
  l.name as language,
  COUNT(DISTINCT s.id) as sections,
  COUNT(DISTINCT u.id) as units
FROM languages l
LEFT JOIN sections s ON s.language_id = l.id
LEFT JOIN units u ON u.language_id = l.id
GROUP BY l.name
ORDER BY l.name;
-- ============================================
-- USER ERROR TRACKING SCHEMA
-- Track user mistakes during lessons for analytics
-- ============================================

-- Table to track individual exercise attempts and errors
CREATE TABLE IF NOT EXISTS exercise_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  
  -- Exercise details
  exercise_type TEXT NOT NULL, -- 'multiple_choice', 'translation', 'matching', 'fill_blank', 'listening'
  question TEXT,
  correct_answer TEXT,
  user_answer TEXT,
  
  -- Attempt tracking
  is_correct BOOLEAN NOT NULL,
  attempt_number INTEGER DEFAULT 1, -- Which attempt this was (1st, 2nd, 3rd, etc.)
  time_spent_seconds INTEGER, -- How long user spent on this question
  
  -- Error categorization
  error_type TEXT, -- 'spelling', 'grammar', 'vocabulary', 'listening', 'translation', 'typo'
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Aggregated error statistics per user per exercise
CREATE TABLE IF NOT EXISTS user_exercise_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  
  total_attempts INTEGER DEFAULT 0,
  correct_attempts INTEGER DEFAULT 0,
  incorrect_attempts INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0, -- Longest streak of correct answers
  avg_time_seconds DECIMAL(10,2),
  last_attempted_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  
  UNIQUE(user_id, exercise_id)
);

-- Common mistakes tracking (aggregated across all users)
CREATE TABLE IF NOT EXISTS common_mistakes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  exercise_type TEXT NOT NULL,
  
  correct_answer TEXT NOT NULL,
  wrong_answer TEXT NOT NULL,
  occurrence_count INTEGER DEFAULT 1,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  
  UNIQUE(exercise_id, wrong_answer)
);

-- Daily error summary for analytics dashboard
CREATE TABLE IF NOT EXISTS daily_error_summary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  language TEXT,
  
  total_attempts INTEGER DEFAULT 0,
  total_errors INTEGER DEFAULT 0,
  unique_users INTEGER DEFAULT 0,
  
  -- Error breakdown by type
  spelling_errors INTEGER DEFAULT 0,
  grammar_errors INTEGER DEFAULT 0,
  vocabulary_errors INTEGER DEFAULT 0,
  listening_errors INTEGER DEFAULT 0,
  translation_errors INTEGER DEFAULT 0,
  
  -- Exercise type breakdown
  multiple_choice_errors INTEGER DEFAULT 0,
  translation_exercise_errors INTEGER DEFAULT 0,
  matching_errors INTEGER DEFAULT 0,
  fill_blank_errors INTEGER DEFAULT 0,
  listening_exercise_errors INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  
  UNIQUE(date, language)
);

-- ============================================
-- RLS POLICIES
-- ============================================

-- Exercise attempts - users see own, admins see all
ALTER TABLE exercise_attempts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own attempts" ON exercise_attempts;
CREATE POLICY "Users can view own attempts" ON exercise_attempts FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own attempts" ON exercise_attempts;
CREATE POLICY "Users can insert own attempts" ON exercise_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can view all attempts" ON exercise_attempts;
CREATE POLICY "Admins can view all attempts" ON exercise_attempts FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- User exercise stats - users see own, admins see all
ALTER TABLE user_exercise_stats ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own stats" ON user_exercise_stats;
CREATE POLICY "Users can view own stats" ON user_exercise_stats FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can manage own stats" ON user_exercise_stats;
CREATE POLICY "Users can manage own stats" ON user_exercise_stats FOR ALL USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can view all stats" ON user_exercise_stats;
CREATE POLICY "Admins can view all stats" ON user_exercise_stats FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- Common mistakes - admin only
ALTER TABLE common_mistakes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage common mistakes" ON common_mistakes;
CREATE POLICY "Admins can manage common mistakes" ON common_mistakes FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- Daily error summary - admin only
ALTER TABLE daily_error_summary ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage daily summary" ON daily_error_summary;
CREATE POLICY "Admins can manage daily summary" ON daily_error_summary FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_exercise_attempts_user ON exercise_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_exercise_attempts_exercise ON exercise_attempts(exercise_id);
CREATE INDEX IF NOT EXISTS idx_exercise_attempts_created ON exercise_attempts(created_at);
CREATE INDEX IF NOT EXISTS idx_exercise_attempts_language ON exercise_attempts(language);
CREATE INDEX IF NOT EXISTS idx_exercise_attempts_correct ON exercise_attempts(is_correct);

CREATE INDEX IF NOT EXISTS idx_user_exercise_stats_user ON user_exercise_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_common_mistakes_exercise ON common_mistakes(exercise_id);
CREATE INDEX IF NOT EXISTS idx_daily_error_summary_date ON daily_error_summary(date);

-- ============================================
-- HELPER FUNCTION TO LOG EXERCISE ATTEMPT
-- ============================================
CREATE OR REPLACE FUNCTION log_exercise_attempt(
  p_user_id UUID,
  p_exercise_id UUID,
  p_lesson_id UUID,
  p_language TEXT,
  p_exercise_type TEXT,
  p_question TEXT,
  p_correct_answer TEXT,
  p_user_answer TEXT,
  p_is_correct BOOLEAN,
  p_time_spent INTEGER DEFAULT NULL,
  p_error_type TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_attempt_id UUID;
  v_attempt_number INTEGER;
BEGIN
  -- Get the attempt number for this user/exercise combo
  SELECT COALESCE(MAX(attempt_number), 0) + 1 INTO v_attempt_number
  FROM exercise_attempts
  WHERE user_id = p_user_id AND exercise_id = p_exercise_id;
  
  -- Insert the attempt
  INSERT INTO exercise_attempts (
    user_id, exercise_id, lesson_id, language, exercise_type,
    question, correct_answer, user_answer, is_correct,
    attempt_number, time_spent_seconds, error_type
  ) VALUES (
    p_user_id, p_exercise_id, p_lesson_id, p_language, p_exercise_type,
    p_question, p_correct_answer, p_user_answer, p_is_correct,
    v_attempt_number, p_time_spent, p_error_type
  ) RETURNING id INTO v_attempt_id;
  
  -- Update user exercise stats
  INSERT INTO user_exercise_stats (user_id, exercise_id, total_attempts, correct_attempts, incorrect_attempts, last_attempted_at)
  VALUES (
    p_user_id, p_exercise_id, 1,
    CASE WHEN p_is_correct THEN 1 ELSE 0 END,
    CASE WHEN p_is_correct THEN 0 ELSE 1 END,
    NOW()
  )
  ON CONFLICT (user_id, exercise_id) DO UPDATE SET
    total_attempts = user_exercise_stats.total_attempts + 1,
    correct_attempts = user_exercise_stats.correct_attempts + CASE WHEN p_is_correct THEN 1 ELSE 0 END,
    incorrect_attempts = user_exercise_stats.incorrect_attempts + CASE WHEN p_is_correct THEN 0 ELSE 1 END,
    last_attempted_at = NOW(),
    updated_at = NOW();
  
  -- Track common mistakes if incorrect
  IF NOT p_is_correct AND p_user_answer IS NOT NULL THEN
    INSERT INTO common_mistakes (exercise_id, language, exercise_type, correct_answer, wrong_answer, occurrence_count)
    VALUES (p_exercise_id, p_language, p_exercise_type, p_correct_answer, p_user_answer, 1)
    ON CONFLICT (exercise_id, wrong_answer) DO UPDATE SET
      occurrence_count = common_mistakes.occurrence_count + 1,
      updated_at = NOW();
  END IF;
  
  RETURN v_attempt_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
