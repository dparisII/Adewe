-- Fix for 500 Internal Server Error (Infinite Recursion in RLS)

-- 1. Create a secure function to check admin status without triggering RLS on the table again
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER -- This runs with the privileges of the function creator (postgres), bypassing RLS
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND is_admin = true
  );
$$;

-- 2. Drop the recursive policy
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- 3. Create the new non-recursive policy using the function
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (is_admin());

-- 4. Apply the same fix for lessons management if needed
DROP POLICY IF EXISTS "Admins can manage lessons" ON lessons;

CREATE POLICY "Admins can manage lessons"
  ON lessons FOR ALL
  USING (is_admin());

-- 5. Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.is_admin TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin TO anon;
