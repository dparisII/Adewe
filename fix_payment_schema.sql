-- Fix Subscription Tiers Schema
ALTER TABLE subscription_tiers 
ADD COLUMN IF NOT EXISTS has_unlimited_hearts BOOLEAN DEFAULT false;

-- Fix User Subscriptions RLS
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow admins to manage all subscriptions
CREATE POLICY "Admins can manage all subscriptions" 
ON user_subscriptions
FOR ALL 
USING (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.is_admin = true
  )
);

-- Fix Payment Transactions RLS
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- Allow admins to manage all transactions
CREATE POLICY "Admins can manage all transactions" 
ON payment_transactions
FOR ALL 
USING (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.is_admin = true
  )
);

-- Fix Promo Codes RLS
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

-- Allow admins to manage all promo codes
CREATE POLICY "Admins can manage all promo codes" 
ON promo_codes
FOR ALL 
USING (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.is_admin = true
  )
);
