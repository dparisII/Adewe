-- FIX: Synchronize Subscription Tiers with User Page
-- Run this in Supabase SQL Editor

-- 1. Add ETB price columns if they don't exist
ALTER TABLE IF EXISTS subscription_tiers ADD COLUMN IF NOT EXISTS price_monthly_etb DECIMAL(10,2) DEFAULT 0;
ALTER TABLE IF EXISTS subscription_tiers ADD COLUMN IF NOT EXISTS price_yearly_etb DECIMAL(10,2) DEFAULT 0;

-- 2. Clean up potentially duplicate or old tiers
-- Optional: Uncomment if you want a fresh start
-- DELETE FROM subscription_tiers WHERE name IN ('Free', 'Premium', 'Family');

-- 3. Seed correct tiers to match Subscribe.jsx
INSERT INTO subscription_tiers (name, description, price_monthly, price_yearly, price_monthly_etb, price_yearly_etb, features, sort_order) 
VALUES 
  ('Free', 'Basic access to lessons', 0, 0, 0, 0, '["5 hearts per day", "Basic lessons", "Limited languages"]', 0),
  ('Super Adewe', 'Ad-free experience with unlimited hearts', 8.99, 79.99, 499, 4499, '["Unlimited Hearts", "No interruptions (no ads)", "Personalized Practice", "Offline Access"]', 1),
  ('Super Family', 'Protect all your family''s hearts', 14.99, 149.99, 1299, 12999, '["Everything in Super", "Up to 6 family members", "Family dashboard", "One bill for all"]', 2),
  ('Adewe Max', 'Advanced AI features for deep learning', 16.99, 169.99, 899, 8999, '["Everything in Super", "AI Roleplay", "Explain My Answer", "Smart Review"]', 3),
  ('Max Family', 'The ultimate learning for everyone', 24.99, 249.99, 1999, 19999, '["Everything in Max", "Up to 6 family members", "Family performance insights", "Priority Support"]', 4)
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  price_monthly = EXCLUDED.price_monthly,
  price_yearly = EXCLUDED.price_yearly,
  price_monthly_etb = EXCLUDED.price_monthly_etb,
  price_yearly_etb = EXCLUDED.price_yearly_etb,
  features = EXCLUDED.features,
  sort_order = EXCLUDED.sort_order;

-- 4. Add unique constraints to prevent duplicates
DO $$ 
BEGIN 
    -- Constraint for subscription_tiers name
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'subscription_tiers_name_key') THEN
        ALTER TABLE subscription_tiers ADD CONSTRAINT subscription_tiers_name_key UNIQUE (name);
    END IF;

    -- Constraint for user_subscriptions user_id (one plan per user)
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_subscriptions_user_id_key') THEN
        ALTER TABLE user_subscriptions ADD CONSTRAINT user_subscriptions_user_id_key UNIQUE (user_id);
    END IF;
END $$;
