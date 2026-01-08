-- 1. Create table if it doesn't exist (basic structure)
CREATE TABLE IF NOT EXISTS local_payment_settings (
  id UUID DEFAULT '00000000-0000-0000-0000-000000000001'::uuid PRIMARY KEY,
  is_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. Add 'bank_accounts' column if missing
ALTER TABLE local_payment_settings 
  ADD COLUMN IF NOT EXISTS bank_accounts JSONB DEFAULT '[]'::jsonb;

-- 3. Add 'instructions' column if missing
ALTER TABLE local_payment_settings 
  ADD COLUMN IF NOT EXISTS instructions TEXT DEFAULT 'Transfer the payment to the bank account details above.';

-- 3.5 Make legacy single-account columns nullable to support multi-account mode
ALTER TABLE local_payment_settings ALTER COLUMN bank_name DROP NOT NULL;
ALTER TABLE local_payment_settings ALTER COLUMN account_name DROP NOT NULL;
ALTER TABLE local_payment_settings ALTER COLUMN account_number DROP NOT NULL;
ALTER TABLE local_payment_settings ALTER COLUMN currency DROP NOT NULL;

-- 4. Enable RLS
ALTER TABLE local_payment_settings ENABLE ROW LEVEL SECURITY;

-- 5. Update RLS Policies
DROP POLICY IF EXISTS "Public can view payment settings" ON local_payment_settings;
CREATE POLICY "Public can view payment settings" 
  ON local_payment_settings FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Admins can update payment settings" ON local_payment_settings;
CREATE POLICY "Admins can update payment settings" 
  ON local_payment_settings FOR ALL 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE));

-- 6. Insert default settings row if not exists
INSERT INTO local_payment_settings (id, is_enabled, bank_accounts, instructions, bank_name, account_name, account_number, currency)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  TRUE,
  '[
    {
      "id": "cbe-001", 
      "bank_name": "Commercial Bank of Ethiopia", 
      "account_name": "Adewe Language Learning", 
      "account_number": "1000123456789", 
      "currency": "ETB"
    }
  ]'::jsonb,
  'Transfer the exact amount and send us your transaction reference number (FT/Invoice No) for verification.',
  'Commercial Bank of Ethiopia', -- Legacy fallback
  'Adewe Language Learning',     -- Legacy fallback
  '1000123456789',               -- Legacy fallback
  'ETB'                          -- Legacy fallback
)
ON CONFLICT (id) DO UPDATE SET
  bank_accounts = EXCLUDED.bank_accounts 
  WHERE local_payment_settings.bank_accounts IS NULL OR local_payment_settings.bank_accounts = '[]'::jsonb;
