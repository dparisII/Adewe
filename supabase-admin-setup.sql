-- Super Admin Setup for PolyglotEthiopia
-- Run this AFTER running supabase-schema.sql

-- First, update the profiles table to add phone and is_admin if they don't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Update the handle_new_user function to include phone and auto-admin
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email, phone, is_admin)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    CASE WHEN NEW.email = 'hi@tech.com' THEN TRUE ELSE FALSE END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- IMPORTANT: To create the super admin account:
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Click "Add user" > "Create new user"
-- 3. Enter:
--    - Email: hi@tech.com
--    - Password: hitech@4321
--    - Check "Auto Confirm User" to skip email verification
-- 4. The trigger will automatically set is_admin = TRUE for this user

-- Alternatively, if you already created the user, run this to make them admin:
-- UPDATE profiles SET is_admin = TRUE WHERE email = 'hi@tech.com';

-- To disable email confirmation for all users (development only):
-- Go to Supabase Dashboard > Authentication > Providers > Email
-- Disable "Confirm email"
