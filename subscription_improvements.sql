-- Add new columns to subscription_tiers for UI control
ALTER TABLE subscription_tiers 
ADD COLUMN IF NOT EXISTS is_popular BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT true;

-- Ensure RLS on user_subscriptions allows admins to view all
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view all subscriptions" ON user_subscriptions;
CREATE POLICY "Admins can view all subscriptions" ON user_subscriptions
    FOR SELECT
    USING (
        auth.jwt() ->> 'role' = 'service_role' OR
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND (role = 'admin' OR role = 'superuser')
        )
    );

DROP POLICY IF EXISTS "Users can view own subscription" ON user_subscriptions;
CREATE POLICY "Users can view own subscription" ON user_subscriptions
    FOR SELECT
    USING (auth.uid() = user_id);

-- Fix foreign key relationships if they are missing (likely cause of empty list if joins fail silently)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'user_subscriptions_user_id_fkey') THEN
        ALTER TABLE user_subscriptions ADD CONSTRAINT user_subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'user_subscriptions_tier_id_fkey') THEN
        ALTER TABLE user_subscriptions ADD CONSTRAINT user_subscriptions_tier_id_fkey FOREIGN KEY (tier_id) REFERENCES subscription_tiers(id) ON DELETE SET NULL;
    END IF;
END $$;
