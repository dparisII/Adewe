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
