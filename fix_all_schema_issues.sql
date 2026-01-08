-- FIX: Update Analytics Schema & Restore Missing Profiles

-- 1. Fix 'site_visits' table schema (Resolves 400 Bad Request errors)
-- The frontend sends 'user_id' and 'metadata', so valid columns are needed.
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES profiles(id) ON DELETE SET NULL;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- 2. Ensure RLS Policy allows inserting these new fields
DROP POLICY IF EXISTS "Anyone can insert a visit" ON site_visits;
CREATE POLICY "Anyone can insert a visit" ON site_visits FOR INSERT WITH CHECK (true);


-- 3. Fix Missing Profiles (Resolves 406 / 'Profile not found' errors)
-- If a user exists in auth.users but not in public.profiles, this query creates the missing row.
-- REMOVED 'full_name' as it does not exist in the schema.
INSERT INTO public.profiles (id, email, username, created_at, updated_at)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'username', split_part(email, '@', 1)), 
  created_at,
  created_at
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles);


-- 4. Ensure "Users can view their own profile" Policy exists
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

-- 5. Helper: Force Admin for current user (Optional safety net)
-- This updates the profile to be admin if it's the one executing this script
-- (No specific update here to avoid overriding intentional non-admins)
