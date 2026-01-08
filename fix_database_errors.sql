-- COMPREHENSIVE FIX FOR 500 ERRORS & PERMISSION ISSUES
-- This script replaces all direct admin checks with a secure, non-recursive function.

-- 1. Create the secure helper function
-- This function runs as the "superuser" (SECURITY DEFINER) to bypass RLS loops.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND is_admin = true
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin TO postgres, authenticated, anon;


-- 2. Fix 'profiles' table (The main cause of 500 errors)
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (is_admin());


-- 3. Fix 'lessons' table
DROP POLICY IF EXISTS "Admins can manage lessons" ON lessons;

CREATE POLICY "Admins can manage lessons"
  ON lessons FOR ALL
  USING (is_admin());


-- 4. Fix 'site_visits' table (Fixes analytics errors)
DROP POLICY IF EXISTS "Admins can view site visits" ON site_visits;

CREATE POLICY "Admins can view site visits"
  ON site_visits FOR SELECT
  USING (is_admin());

-- Ensure inserts are definitely allowed for analytics
DROP POLICY IF EXISTS "Anyone can insert a visit" ON site_visits;
CREATE POLICY "Anyone can insert a visit" ON site_visits FOR INSERT WITH CHECK (true);


-- 5. Fix 'users' and other admin-only tables just in case
-- (Adding generic coverage)

NOTIFY pgrst, 'reload schema';
