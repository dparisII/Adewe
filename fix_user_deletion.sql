-- FIX USER DELETION: Enable Cascading Deletes
-- This script ensures that when a user (profile) is deleted, all related data is also removed.

DO $$ 
DECLARE 
    r RECORD;
BEGIN
    -- 1. Find and drop existing foreign keys that don't have CASCADE
    FOR r IN (
        SELECT 
            tc.table_name, 
            kcu.column_name, 
            con.conname as constraint_name
        FROM 
            information_schema.table_constraints AS tc 
            JOIN information_schema.key_column_usage AS kcu
              ON tc.constraint_name = kcu.constraint_name
              AND tc.table_schema = kcu.table_schema
            JOIN pg_constraint AS con
              ON con.conname = tc.constraint_name
            JOIN pg_class AS c ON c.oid = con.confrelid
        WHERE 
            tc.constraint_type = 'FOREIGN KEY' 
            AND c.relname = 'profiles'
            AND tc.table_schema = 'public'
    ) LOOP
        EXECUTE 'ALTER TABLE public.' || quote_ident(r.table_name) || ' DROP CONSTRAINT ' || quote_ident(r.constraint_name);
        
        -- 2. Re-create the constraint with ON DELETE CASCADE
        EXECUTE 'ALTER TABLE public.' || quote_ident(r.table_name) || 
                ' ADD CONSTRAINT ' || quote_ident(r.constraint_name) || 
                ' FOREIGN KEY (' || quote_ident(r.column_name) || ') REFERENCES profiles(id) ON DELETE CASCADE';
    END LOOP;
END $$;

-- 3. Explicitly check core tables often missed or requiring specific handling
ALTER TABLE IF EXISTS user_subscriptions 
  DROP CONSTRAINT IF EXISTS user_subscriptions_user_id_fkey,
  ADD CONSTRAINT user_subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE IF EXISTS local_payment_requests 
  DROP CONSTRAINT IF EXISTS local_payment_requests_user_id_fkey,
  ADD CONSTRAINT local_payment_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE IF EXISTS exercise_attempts 
  DROP CONSTRAINT IF EXISTS exercise_attempts_user_id_fkey,
  ADD CONSTRAINT exercise_attempts_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- 4. Notification to developer/admin
-- These changes allow DELETE FROM profiles WHERE id = '...' to work even if the user has attempts, subscriptions, etc.
