-- 1. Helper function to check admin status safely (bypasses RLS recursion)
CREATE OR REPLACE FUNCTION public.is_app_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER -- Runs with privileges of the creator (superuser)
SET search_path = public -- Secure search path
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND is_admin = true
  );
$$;

-- 2. Fix Profiles RLS (Recursion Source)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Public profiles access" ON profiles;

-- Allow users to see themselves, OR admins to see everyone
CREATE POLICY "Profiles visibility" ON profiles
FOR SELECT USING (
  id = auth.uid() OR is_app_admin()
);

-- Allow users to update themselves
CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE USING (
  id = auth.uid()
);

-- 3. Fix User Subscriptions RLS
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view all subscriptions" ON user_subscriptions;
DROP POLICY IF EXISTS "Users can view own subscription" ON user_subscriptions;

CREATE POLICY "Subscriptions visibility" ON user_subscriptions
FOR SELECT USING (
  user_id = auth.uid() OR is_app_admin()
);

-- 4. Fix Payment Requests RLS
-- Assuming table is local_payment_requests
ALTER TABLE local_payment_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view all requests" ON local_payment_requests;
DROP POLICY IF EXISTS "Users can view own requests" ON local_payment_requests;

CREATE POLICY "Payment requests visibility" ON local_payment_requests
FOR SELECT USING (
  user_id = auth.uid() OR is_app_admin()
);

-- 5. Fix Analytics (Site Visits) RLS
ALTER TABLE site_visits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view details" ON site_visits;
DROP POLICY IF EXISTS "Anyone can insert details" ON site_visits;

CREATE POLICY "Admins can view analytics" ON site_visits
FOR SELECT USING (
  is_app_admin()
);

CREATE POLICY "Anyone can insert analytics" ON site_visits
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can delete analytics" ON site_visits
FOR DELETE USING (
  is_app_admin()
);

-- 6. Subscription Tiers (Public Read)
ALTER TABLE subscription_tiers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read tiers" ON subscription_tiers;
CREATE POLICY "Anyone can read tiers" ON subscription_tiers
FOR SELECT USING (true);

-- 7. Promo Codes (Admin Only)
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage promo codes" ON promo_codes;
CREATE POLICY "Admins can manage promo codes" ON promo_codes
FOR ALL USING (
  is_app_admin()
);

-- 8. Fix clear_site_visits function to use the new check
CREATE OR REPLACE FUNCTION clear_site_visits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NOT is_app_admin() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  DELETE FROM site_visits;
END;
$$;
