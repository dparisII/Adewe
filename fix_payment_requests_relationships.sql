-- FIX: Ensure local_payment_requests has correct Foreign Keys and RLS
-- This is critical for the Admin Panel to fetch user and tier details

-- 1. Add Foreign Key to profiles (user_id)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'local_payment_requests_user_id_fkey') THEN
    ALTER TABLE local_payment_requests 
    ADD CONSTRAINT local_payment_requests_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 2. Add Foreign Key to subscription_tiers (tier_id)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'local_payment_requests_tier_id_fkey') THEN
    ALTER TABLE local_payment_requests 
    ADD CONSTRAINT local_payment_requests_tier_id_fkey 
    FOREIGN KEY (tier_id) REFERENCES subscription_tiers(id);
  END IF;
END $$;

-- 3. Reset RLS Policies to be absolutely sure they are correct
ALTER TABLE local_payment_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own requests" ON local_payment_requests;
CREATE POLICY "Users can view their own requests" 
  ON local_payment_requests FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own requests" ON local_payment_requests;
CREATE POLICY "Users can insert their own requests" 
  ON local_payment_requests FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all requests" ON local_payment_requests;
CREATE POLICY "Admins can manage all requests" 
  ON local_payment_requests FOR ALL 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE));

-- 4. Verify/Fix Subscription Tiers FK if needed (optional safety)
-- In case some tiers were deleted and their IDs are still referenced, set them to NULL or a default
-- (For now, we just leave it, relying on the FK constraint to error if we try to delete a used tier)
