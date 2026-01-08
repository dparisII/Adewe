-- REPAIR SCRIPT: Fix Missing Subscriptions and Transactions
-- This script finds 'approved' payment requests that are missing their corresponding 
-- user_subscriptions or payment_transactions records and creates them.

-- 1. Insert missing subscriptions for approved requests
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
    NOW() + INTERVAL '1 year' -- Default to 1 year, or adjust if you track monthly vs yearly in requests
FROM local_payment_requests lpr
WHERE lpr.status = 'approved'
AND NOT EXISTS (
    SELECT 1 FROM user_subscriptions us 
    WHERE us.user_id = lpr.user_id 
    AND us.tier_id = lpr.tier_id
);

-- 2. Insert missing transactions for approved requests
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
    (SELECT id FROM user_subscriptions us WHERE us.user_id = lpr.user_id AND us.tier_id = lpr.tier_id LIMIT 1),
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
WHERE lpr.status = 'approved'
AND NOT EXISTS (
    SELECT 1 FROM payment_transactions pt 
    WHERE pt.external_transaction_id = lpr.transaction_reference
);

-- 3. Ensure 'hi@tech.com' is admin (Again, just to be safe)
UPDATE profiles
SET is_admin = true
WHERE email = 'hi@tech.com';
