-- FORCE ADMIN PERMISSIONS
-- This ensures the specific user 'hi@tech.com' is definitely an admin

UPDATE profiles
SET is_admin = true
WHERE email = 'hi@tech.com';

-- Just in case the email is different or we want to catch the current user
-- (Note: exact email match is safest for a specific user fix)

-- Also verify the tiers exist. If no tiers exist, the insert might fail on foreign key constraint.
-- Let's ensure at least one basic tier exists if empty.
INSERT INTO subscription_tiers (name, price_monthly, price_monthly_etb, has_unlimited_hearts)
SELECT 'Free', 0, 0, false
WHERE NOT EXISTS (SELECT 1 FROM subscription_tiers);
