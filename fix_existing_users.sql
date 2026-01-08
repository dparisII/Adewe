-- Backfill missing profile data from auth.users (for existing users)
-- This ONLY uses data from auth.users metadata - no arbitrary defaults

UPDATE public.profiles p
SET 
    -- Backfill Email if missing
    email = COALESCE(p.email, u.email),
    
    -- Backfill Username if missing (fallback to email prefix)
    username = COALESCE(p.username, u.raw_user_meta_data->>'username', split_part(u.email, '@', 1)),
    
    -- Backfill Languages ONLY from metadata (no fake defaults)
    native_language = COALESCE(p.native_language, u.raw_user_meta_data->>'native_language'),
    learning_language = COALESCE(p.learning_language, u.raw_user_meta_data->>'learning_language'),
    
    -- Ensure Update Time
    updated_at = now()
FROM auth.users u
WHERE p.id = u.id
AND (
    p.email IS NULL OR
    p.learning_language IS NULL OR 
    p.native_language IS NULL
);

-- NOTE: Users who signed up BEFORE the trigger fix and did NOT have language
-- in their auth metadata will STILL show "Not Set". This is expected because
-- the original data was never captured. These users will need to:
--   1. Go to /select-language in the app and re-select their languages, OR
--   2. An admin can manually update their profile in the database.
