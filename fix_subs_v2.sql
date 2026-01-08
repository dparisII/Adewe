-- REPAIR SCRIPT V2: Case-Insensitive Backfill & Force Insert
-- 1. Insert missing subscriptions (CASE INSENSITIVE STATUS CHECK)
INSERT INTO user_subscriptions (
    user_id, 
    tier_id, 
    status, 
    payment_provider, 
    current_period_start, 
    current_period_end
)
SELECT 
    lpr.user_id,
    lpr.tier_id,
    'active',
    'local_bank',
    NOW(),
    NOW() + INTERVAL '1 year'
FROM local_payment_requests lpr
WHERE LOWER(lpr.status) = 'approved'
AND NOT EXISTS (
    SELECT 1 FROM user_subscriptions us 
    WHERE us.user_id = lpr.user_id
);

-- 2. Insert missing transactions (CASE INSENSITIVE CHECK)
INSERT INTO payment_transactions (
    user_id,
    subscription_id,
    amount,
    currency,
    status,
    payment_provider,
    external_transaction_id,
    metadata
)
SELECT 
    lpr.user_id,
    (SELECT id FROM user_subscriptions us WHERE us.user_id = lpr.user_id LIMIT 1),
    lpr.amount,
    lpr.currency,
    'completed',
    'local_bank',
    lpr.transaction_reference,
    jsonb_build_object(
        'payer_name', lpr.payer_name,
        'bank_name', lpr.bank_name,
        'request_id', lpr.id
    )
FROM local_payment_requests lpr
WHERE LOWER(lpr.status) = 'approved'
AND NOT EXISTS (
    SELECT 1 FROM payment_transactions pt 
    WHERE pt.external_transaction_id = lpr.transaction_reference
);

-- 3. FORCE INSERT FOR ADMIN (Backup verification)
-- If list is still empty, this record MUST show up if RLS is working.
-- Explicitly insert a subscription for 'hi@tech.com' (using their user_id found via email)
DO $$
DECLARE
    admin_id uuid;
    tier_id uuid;
BEGIN
    SELECT id INTO admin_id FROM profiles WHERE email = 'hi@tech.com';
    SELECT id INTO tier_id FROM subscription_tiers LIMIT 1;

    IF admin_id IS NOT NULL AND tier_id IS NOT NULL THEN
        -- Check if exists first to avoid "ON CONFLICT" error (since unique constraint might be missing)
        IF EXISTS (SELECT 1 FROM user_subscriptions WHERE user_id = admin_id) THEN
            UPDATE user_subscriptions SET status = 'active' WHERE user_id = admin_id;
        ELSE
            INSERT INTO user_subscriptions (user_id, tier_id, status, payment_provider, current_period_start, current_period_end)
            VALUES (admin_id, tier_id, 'active', 'manual_admin', NOW(), NOW() + INTERVAL '1 year');
        END IF;
    END IF;
END $$;
