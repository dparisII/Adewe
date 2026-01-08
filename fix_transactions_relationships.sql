-- REPAIR SCRIPT V4: Fix Transaction Foreign Keys
-- This script ensures payment_transactions can link to profiles for the UI

ALTER TABLE payment_transactions
DROP CONSTRAINT IF EXISTS payment_transactions_user_id_fkey;

ALTER TABLE payment_transactions
ADD CONSTRAINT payment_transactions_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES profiles(id)
ON DELETE CASCADE;

-- Also let's ensure subscription link is safe
ALTER TABLE payment_transactions
DROP CONSTRAINT IF EXISTS payment_transactions_subscription_id_fkey;

ALTER TABLE payment_transactions
ADD CONSTRAINT payment_transactions_subscription_id_fkey
FOREIGN KEY (subscription_id)
REFERENCES user_subscriptions(id)
ON DELETE SET NULL;

-- Notify reload
NOTIFY pgrst, 'reload config';
