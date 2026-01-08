-- FIX: Allow Admins to Delete Subscription Tiers
-- Uses is_admin boolean column instead of role

-- Drop any existing restrictive policies on delete
DROP POLICY IF EXISTS "Admins can delete tiers" ON subscription_tiers;
DROP POLICY IF EXISTS "Admins have full access to tiers" ON subscription_tiers;

-- Create a comprehensive policy for admin access (ALL operations: SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "Admins have full access to tiers"
ON subscription_tiers
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Ensure RLS is enabled
ALTER TABLE subscription_tiers ENABLE ROW LEVEL SECURITY;

-- Grant table-level permissions
GRANT DELETE ON subscription_tiers TO authenticated;

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
