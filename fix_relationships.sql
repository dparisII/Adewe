-- REPAIR SCRIPT V3: Fix Foreign Key Relationships
-- This script explicitly adds constraints to ensure Supabase can "see" the relationships

-- 1. Fix User Relationship
-- Drop if exists to avoid errors
ALTER TABLE user_subscriptions 
DROP CONSTRAINT IF EXISTS user_subscriptions_user_id_fkey;

-- Re-add with explicit reference
ALTER TABLE user_subscriptions
ADD CONSTRAINT user_subscriptions_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES profiles(id)
ON DELETE CASCADE;

-- 2. Fix Tier Relationship
ALTER TABLE user_subscriptions 
DROP CONSTRAINT IF EXISTS user_subscriptions_tier_id_fkey;

ALTER TABLE user_subscriptions
ADD CONSTRAINT user_subscriptions_tier_id_fkey
FOREIGN KEY (tier_id)
REFERENCES subscription_tiers(id)
ON DELETE CASCADE;

-- 3. Notify PostgREST to reload schema
NOTIFY pgrst, 'reload config';
