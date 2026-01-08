-- FIX: Add missing columns to subscription_tiers table
-- This resolves the "Column not found" errors when saving tiers.

ALTER TABLE subscription_tiers 
ADD COLUMN IF NOT EXISTS is_popular BOOLEAN DEFAULT false;

ALTER TABLE subscription_tiers 
ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT true;

ALTER TABLE subscription_tiers 
ADD COLUMN IF NOT EXISTS has_unlimited_hearts BOOLEAN DEFAULT false;

ALTER TABLE subscription_tiers 
ADD COLUMN IF NOT EXISTS price_monthly_etb DECIMAL(10,2) DEFAULT 0;

ALTER TABLE subscription_tiers 
ADD COLUMN IF NOT EXISTS price_yearly_etb DECIMAL(10,2) DEFAULT 0;

-- Refresh schema cache advice
NOTIFY pgrst, 'reload schema';
