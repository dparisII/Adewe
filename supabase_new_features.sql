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

CREATE POLICY "Anyone can see follows" ON user_follows FOR SELECT USING (true);
DROP POLICY IF EXISTS "Anyone can see follows" ON user_follows;
CREATE POLICY "Anyone can see follows" ON user_follows FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can follow" ON user_follows;
CREATE POLICY "Authenticated users can follow" ON user_follows FOR INSERT WITH CHECK (auth.uid() = follower_id);

DROP POLICY IF EXISTS "Users can unfollow" ON user_follows;
CREATE POLICY "Users can unfollow" ON user_follows FOR DELETE USING (auth.uid() = follower_id);

-- Legal Documents Table
CREATE TABLE IF NOT EXISTS legal_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT UNIQUE NOT NULL, -- privacy_policy, terms_of_use, etc.
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  version INTEGER DEFAULT 1,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE legal_documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view published legal docs" ON legal_documents;
CREATE POLICY "Anyone can view published legal docs" ON legal_documents FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Admins can manage legal docs" ON legal_documents;
CREATE POLICY "Admins can manage legal docs" ON legal_documents FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  )
);

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
