-- ============================================
-- FIX ERROR TRACKING SCHEMA
-- Refactor to handle TEXT IDs and remove FK constraints
-- ============================================

-- 1. Modify exercise_attempts table
ALTER TABLE exercise_attempts DROP CONSTRAINT IF EXISTS exercise_attempts_exercise_id_fkey;
ALTER TABLE exercise_attempts DROP CONSTRAINT IF EXISTS exercise_attempts_lesson_id_fkey;
ALTER TABLE exercise_attempts ALTER COLUMN exercise_id TYPE TEXT;
ALTER TABLE exercise_attempts ALTER COLUMN lesson_id TYPE TEXT;

-- 2. Modify common_mistakes table
ALTER TABLE common_mistakes DROP CONSTRAINT IF EXISTS common_mistakes_exercise_id_fkey;
ALTER TABLE common_mistakes ALTER COLUMN exercise_id TYPE TEXT;

-- 3. Modify user_exercise_stats table
ALTER TABLE user_exercise_stats DROP CONSTRAINT IF EXISTS user_exercise_stats_exercise_id_fkey;
ALTER TABLE user_exercise_stats ALTER COLUMN exercise_id TYPE TEXT;

-- 4. Re-create or Update log_exercise_attempt function
CREATE OR REPLACE FUNCTION log_exercise_attempt(
  p_user_id UUID,
  p_exercise_id TEXT,
  p_lesson_id TEXT,
  p_language TEXT,
  p_exercise_type TEXT,
  p_question TEXT,
  p_correct_answer TEXT,
  p_user_answer TEXT,
  p_is_correct BOOLEAN,
  p_time_spent INTEGER DEFAULT NULL,
  p_error_type TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_attempt_id UUID;
  v_attempt_number INTEGER;
BEGIN
  -- Get the attempt number for this user/exercise combo
  SELECT COALESCE(MAX(attempt_number), 0) + 1 INTO v_attempt_number
  FROM exercise_attempts
  WHERE user_id = p_user_id AND exercise_id = p_exercise_id;
  
  -- Insert the attempt
  INSERT INTO exercise_attempts (
    user_id, exercise_id, lesson_id, language, exercise_type,
    question, correct_answer, user_answer, is_correct,
    attempt_number, time_spent_seconds, error_type
  ) VALUES (
    p_user_id, p_exercise_id, p_lesson_id, p_language, p_exercise_type,
    p_question, p_correct_answer, p_user_answer, p_is_correct,
    v_attempt_number, p_time_spent, p_error_type
  ) RETURNING id INTO v_attempt_id;
  
  -- Update user exercise stats
  INSERT INTO user_exercise_stats (user_id, exercise_id, total_attempts, correct_attempts, incorrect_attempts, last_attempted_at)
  VALUES (
    p_user_id, p_exercise_id, 1,
    CASE WHEN p_is_correct THEN 1 ELSE 0 END,
    CASE WHEN p_is_correct THEN 0 ELSE 1 END,
    NOW()
  )
  ON CONFLICT (user_id, exercise_id) DO UPDATE SET
    total_attempts = user_exercise_stats.total_attempts + 1,
    correct_attempts = user_exercise_stats.correct_attempts + CASE WHEN p_is_correct THEN 1 ELSE 0 END,
    incorrect_attempts = user_exercise_stats.incorrect_attempts + CASE WHEN p_is_correct THEN 0 ELSE 1 END,
    last_attempted_at = NOW(),
    updated_at = NOW();
  
  -- Track common mistakes if incorrect
  IF NOT p_is_correct AND p_user_answer IS NOT NULL THEN
    INSERT INTO common_mistakes (exercise_id, language, exercise_type, correct_answer, wrong_answer, occurrence_count)
    VALUES (p_exercise_id, p_language, p_exercise_type, p_correct_answer, p_user_answer, 1)
    ON CONFLICT (exercise_id, wrong_answer) DO UPDATE SET
      occurrence_count = common_mistakes.occurrence_count + 1,
      updated_at = NOW();
  END IF;
  
  RETURN v_attempt_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
