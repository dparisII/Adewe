-- 1. Add 'has_unlimited_hearts' to subscription_tiers
ALTER TABLE subscription_tiers 
ADD COLUMN IF NOT EXISTS has_unlimited_hearts BOOLEAN DEFAULT false;

-- 2. Ensure RLS on user_subscriptions is correct
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

DROP POLICY IF EXISTS "Service role manages all" ON user_subscriptions;
CREATE POLICY "Service role manages all" ON user_subscriptions
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');

-- 3. Repair missing subscriptions for approved payments
-- This attempts to insert a subscription for any approved local payment request that doesn't have one
INSERT INTO user_subscriptions (user_id, tier_id, status, payment_provider, current_period_start, current_period_end)
SELECT 
    lpr.user_id, 
    lpr.tier_id, 
    'active', 
    'local_bank', 
    NOW(), 
    NOW() + INTERVAL '30 days'
FROM local_payment_requests lpr
WHERE lpr.status = 'approved'
AND NOT EXISTS (
    SELECT 1 FROM user_subscriptions us 
    WHERE us.user_id = lpr.user_id
)
ON CONFLICT (user_id) DO NOTHING;
