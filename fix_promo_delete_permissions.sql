-- FIX: Allow Admins to Delete Promo Codes
-- This script ensures RLS policies allow admins to delete promo codes

-- Drop any existing restrictive policies
DROP POLICY IF EXISTS "Admins can manage promo codes" ON promo_codes;
DROP POLICY IF EXISTS "Admins have full access to promo codes" ON promo_codes;

-- Create a comprehensive policy for admin access (ALL operations)
CREATE POLICY "Admins have full access to promo codes"
ON promo_codes
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
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON promo_codes TO authenticated;

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
