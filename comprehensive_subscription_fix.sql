-- COMPREHENSIVE FIX: Subscription Tiers & Payment Requests
-- Run this in Supabase SQL Editor to resolve all pricing errors

-- 1. Ensure 'subscription_tiers' table has all required columns
ALTER TABLE IF EXISTS subscription_tiers 
  ADD COLUMN IF NOT EXISTS price_monthly_etb DECIMAL(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS price_yearly_etb DECIMAL(10,2) DEFAULT 0;

-- 2. Optional: Standardize existing tiers (if any) to prevent nulls
UPDATE subscription_tiers SET price_monthly_etb = 0 WHERE price_monthly_etb IS NULL;
UPDATE subscription_tiers SET price_yearly_etb = 0 WHERE price_yearly_etb IS NULL;

-- 3. Ensure 'local_payment_requests' table exists and has correct 'amount' type
CREATE TABLE IF NOT EXISTS local_payment_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  tier_id UUID REFERENCES subscription_tiers(id),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'ETB',
  transaction_reference TEXT NOT NULL,
  bank_name TEXT,
  payer_name TEXT,
  payer_phone TEXT,
  status TEXT DEFAULT 'pending',
  admin_notes TEXT,
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 4. Set NOT NULL constraint on amount if it was somehow removed or not there
-- (In case the table existed but amount was nullable)
ALTER TABLE local_payment_requests ALTER COLUMN amount SET NOT NULL;

-- 5. Update RLS Policies for local_payment_requests
ALTER TABLE local_payment_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own requests" ON local_payment_requests;
CREATE POLICY "Users can view their own requests" 
  ON local_payment_requests FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own requests" ON local_payment_requests;
CREATE POLICY "Users can insert their own requests" 
  ON local_payment_requests FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all requests" ON local_payment_requests;
CREATE POLICY "Admins can manage all requests" 
  ON local_payment_requests FOR ALL 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE));

-- 5.4 Deduplicate tiers safely by re-parenting existing references
DO $$ 
DECLARE
    dup RECORD;
BEGIN
    FOR dup IN (
        SELECT name, id as keep_id 
        FROM (
            SELECT name, id, ROW_NUMBER() OVER (PARTITION BY name ORDER BY created_at DESC) as row_num
            FROM subscription_tiers
        ) t WHERE t.row_num = 1
    ) LOOP
        -- Update any table that references subscription_tiers
        UPDATE local_payment_requests 
        SET tier_id = dup.keep_id 
        WHERE tier_id IN (SELECT id FROM subscription_tiers WHERE name = dup.name AND id != dup.keep_id);
        
        UPDATE user_subscriptions 
        SET tier_id = dup.keep_id 
        WHERE tier_id IN (SELECT id FROM subscription_tiers WHERE name = dup.name AND id != dup.keep_id);
        
        -- Delete the duplicates for this name
        DELETE FROM subscription_tiers WHERE name = dup.name AND id != dup.keep_id;
    END LOOP;
END $$;

-- 5.5 Ensure unique constraint for ON CONFLICT
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'subscription_tiers_name_key') THEN
        ALTER TABLE subscription_tiers ADD CONSTRAINT subscription_tiers_name_key UNIQUE (name);
    END IF;
END $$;

-- 6. Insert/Update default tiers to match the frontend expectations
INSERT INTO subscription_tiers (name, description, price_monthly, price_yearly, price_monthly_etb, price_yearly_etb, features, sort_order) 
VALUES 
  ('Free', 'Basic access to lessons', 0, 0, 0, 0, '["5 hearts per day", "Basic lessons", "Limited languages"]', 0),
  ('Super Adewe', 'Ad-free experience with unlimited hearts', 8.99, 79.99, 499, 4499, '["Unlimited Hearts", "No interruptions (no ads)", "Personalized Practice", "Offline Access"]', 1),
  ('Super Family', 'Protect all your family''s hearts', 14.99, 149.99, 1299, 12999, '["Everything in Super", "Up to 6 family members", "Family dashboard", "One bill for all"]', 2),
  ('Adewe Max', 'Advanced AI features for deep learning', 16.99, 169.99, 899, 8999, '["Everything in Super", "AI Roleplay", "Explain My Answer", "Smart Review"]', 3),
  ('Max Family', 'The ultimate learning for everyone', 24.99, 249.99, 1999, 19999, '["Everything in Max", "Up to 6 family members", "Family performance insights", "Priority Support"]', 4)
ON CONFLICT (name) DO UPDATE SET
  price_monthly_etb = EXCLUDED.price_monthly_etb,
  price_yearly_etb = EXCLUDED.price_yearly_etb;
