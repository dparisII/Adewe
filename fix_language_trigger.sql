-- Refine the trigger function to properly extract language data from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    username, 
    role, 
    native_language, 
    learning_language,
    created_at,
    updated_at,
    xp,
    streak,
    hearts,
    gems
  )
  VALUES (
    new.id,
    new.email,
    -- Fallback to username from metadata, or email prefix
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    'user',
    -- Extract languages from metadata. Fallback to null (Not Set) if missing.
    new.raw_user_meta_data->>'native_language',
    new.raw_user_meta_data->>'learning_language',
    now(),
    now(),
    0, 0, 5, 0
  )
  ON CONFLICT (id) DO UPDATE SET
    username = EXCLUDED.username,
    native_language = COALESCE(EXCLUDED.native_language, profiles.native_language),
    learning_language = COALESCE(EXCLUDED.learning_language, profiles.learning_language),
    updated_at = now();

  RETURN new;
END;
$$;

-- Helper to update existing users who have metadata but missing profile data
-- This is a "repair" step
DO $$
DECLARE
  r RECORD;
BEGIN
  -- We cannot easily loop over auth.users for security reasons in standard query
  -- But we can't do it here easily either unless we are superuser.
  -- The trigger fix handles NEW users.
  -- For existing "Not Set" users, they must update their profile manually or via admin.
  NULL;
END;
$$;
