-- 1. Analytics / Site Visits Policies
ALTER TABLE site_visits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can insert details" ON site_visits; 
CREATE POLICY "Anyone can insert details" ON site_visits FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view details" ON site_visits;
CREATE POLICY "Admins can view details" ON site_visits FOR SELECT USING (
  auth.jwt() ->> 'role' = 'service_role' OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

DROP POLICY IF EXISTS "Admins can delete details" ON site_visits;
CREATE POLICY "Admins can delete details" ON site_visits FOR DELETE USING (
  auth.jwt() ->> 'role' = 'service_role' OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- 2. Profiles Policies (Ensure admins can see all)
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
  auth.jwt() ->> 'role' = 'service_role' OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- 3. Subscription Policies (Ensure admins can see all)
DROP POLICY IF EXISTS "Admins can view all subscriptions" ON user_subscriptions;
CREATE POLICY "Admins can view all subscriptions" ON user_subscriptions FOR SELECT USING (
  auth.jwt() ->> 'role' = 'service_role' OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- 4. RPC details for clearing logs (Optional, usually direct delete works if policy is right)
-- But sometimes RPC is safer/easier
CREATE OR REPLACE FUNCTION clear_site_visits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only allow if caller is admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND (role = 'admin' OR role = 'superuser')
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  DELETE FROM site_visits;
END;
$$;
