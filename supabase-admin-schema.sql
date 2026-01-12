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
-- 4. UNITS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS units (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  language_code TEXT REFERENCES languages(code) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
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
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
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
CREATE POLICY "Anyone can view branding" ON branding_settings FOR SELECT USING (true);
CREATE POLICY "Admins can update branding" ON branding_settings FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- Legal documents - public read, admin write
ALTER TABLE legal_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published legal docs" ON legal_documents FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Admins can manage legal docs" ON legal_documents FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- Languages - public read, admin write
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active languages" ON languages FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admins can manage languages" ON languages FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- Units - public read, admin write
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published units" ON units FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Admins can manage units" ON units FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- Exercises - public read, admin write
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published exercises" ON exercises FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Admins can manage exercises" ON exercises FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- Audio files - public read, admin write
ALTER TABLE audio_files ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view audio files" ON audio_files FOR SELECT USING (true);
CREATE POLICY "Admins can manage audio files" ON audio_files FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- Subscription tiers - public read
ALTER TABLE subscription_tiers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active tiers" ON subscription_tiers FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admins can manage tiers" ON subscription_tiers FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- User subscriptions - users see own, admins see all
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own subscription" ON user_subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage subscriptions" ON user_subscriptions FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- Payment transactions - users see own, admins see all
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own transactions" ON payment_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all transactions" ON payment_transactions FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- Analytics - admin only
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view analytics" ON analytics_events FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);
CREATE POLICY "System can insert analytics" ON analytics_events FOR INSERT WITH CHECK (true);

-- API usage - admin only
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view api usage" ON api_usage FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- Hasab AI settings - admin only
ALTER TABLE hasab_ai_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage hasab ai settings" ON hasab_ai_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- Payment settings - admin only
ALTER TABLE payment_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage payment settings" ON payment_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- Promo codes - admin only
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage promo codes" ON promo_codes FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- Local payment settings - public read, admin write
ALTER TABLE local_payment_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view local payment settings" ON local_payment_settings FOR SELECT USING (is_enabled = TRUE);
CREATE POLICY "Admins can manage local payment settings" ON local_payment_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- Local payment requests - users see own, admins see all
ALTER TABLE local_payment_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own payment requests" ON local_payment_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create payment requests" ON local_payment_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
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
