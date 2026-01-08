-- COMPREHENSIVE FIX FOR PAYMENT TABLES --

-- 1. FIX SUBSCRIPTION TIERS
-- Ensure constraints don't block us
ALTER TABLE subscription_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_tiers ADD COLUMN IF NOT EXISTS has_unlimited_hearts BOOLEAN DEFAULT false;

-- Drop ALL existing policies to ensure clean slate
DROP POLICY IF EXISTS "Admins can manage tiers" ON subscription_tiers;
DROP POLICY IF EXISTS "Anyone can read tiers" ON subscription_tiers;
DROP POLICY IF EXISTS "Public read access" ON subscription_tiers;

-- Recreate Policies
CREATE POLICY "Admins can manage tiers" ON subscription_tiers
FOR ALL USING (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);

CREATE POLICY "Anyone can read tiers" ON subscription_tiers
FOR SELECT USING (true);


-- 2. FIX USER SUBSCRIPTIONS
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies
DROP POLICY IF EXISTS "Admins can manage all subscriptions" ON user_subscriptions;
DROP POLICY IF EXISTS "Admins can view all subscriptions" ON user_subscriptions;
DROP POLICY IF EXISTS "Users can view own subscription" ON user_subscriptions;
DROP POLICY IF EXISTS "Subscriptions visibility" ON user_subscriptions;

-- Recreate Policies
CREATE POLICY "Admins can manage all subscriptions" ON user_subscriptions
FOR ALL USING (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);

CREATE POLICY "Users can view own subscription" ON user_subscriptions
FOR SELECT USING (
  user_id = auth.uid()
);


-- 3. FIX PAYMENT TRANSACTIONS
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies
DROP POLICY IF EXISTS "Admins can manage all transactions" ON payment_transactions;
DROP POLICY IF EXISTS "Users can view own transactions" ON payment_transactions;

-- Recreate Policies
CREATE POLICY "Admins can manage all transactions" ON payment_transactions
FOR ALL USING (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);

CREATE POLICY "Users can view own transactions" ON payment_transactions
FOR SELECT USING (
  user_id = auth.uid()
);


-- 4. FIX PROMO CODES
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies
DROP POLICY IF EXISTS "Admins can manage promo codes" ON promo_codes;
DROP POLICY IF EXISTS "Admins can manage all promo codes" ON promo_codes;
DROP POLICY IF EXISTS "Users can read active promo codes" ON promo_codes;

-- Recreate Policies
CREATE POLICY "Admins can manage promo codes" ON promo_codes
FOR ALL USING (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);

CREATE POLICY "Users can read active promo codes" ON promo_codes
FOR SELECT USING (
  is_active = true
);


-- 5. FIX LOCAL PAYMENT REQUESTS (Just in case)
ALTER TABLE local_payment_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage requests" ON local_payment_requests;
DROP POLICY IF EXISTS "Users can view own requests" ON local_payment_requests;
DROP POLICY IF EXISTS "Users can create requests" ON local_payment_requests;

CREATE POLICY "Admins can manage requests" ON local_payment_requests
FOR ALL USING (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);

CREATE POLICY "Users can view own requests" ON local_payment_requests
FOR SELECT USING (
  user_id = auth.uid()
);

CREATE POLICY "Users can create requests" ON local_payment_requests
FOR INSERT WITH CHECK (
  user_id = auth.uid()
);
