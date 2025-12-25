-- ============================================
-- USER ERROR TRACKING SCHEMA
-- Track user mistakes during lessons for analytics
-- ============================================

-- Table to track individual exercise attempts and errors
CREATE TABLE IF NOT EXISTS exercise_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  
  -- Exercise details
  exercise_type TEXT NOT NULL, -- 'multiple_choice', 'translation', 'matching', 'fill_blank', 'listening'
  question TEXT,
  correct_answer TEXT,
  user_answer TEXT,
  
  -- Attempt tracking
  is_correct BOOLEAN NOT NULL,
  attempt_number INTEGER DEFAULT 1, -- Which attempt this was (1st, 2nd, 3rd, etc.)
  time_spent_seconds INTEGER, -- How long user spent on this question
  
  -- Error categorization
  error_type TEXT, -- 'spelling', 'grammar', 'vocabulary', 'listening', 'translation', 'typo'
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Aggregated error statistics per user per exercise
CREATE TABLE IF NOT EXISTS user_exercise_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  
  total_attempts INTEGER DEFAULT 0,
  correct_attempts INTEGER DEFAULT 0,
  incorrect_attempts INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0, -- Longest streak of correct answers
  avg_time_seconds DECIMAL(10,2),
  last_attempted_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  
  UNIQUE(user_id, exercise_id)
);

-- Common mistakes tracking (aggregated across all users)
CREATE TABLE IF NOT EXISTS common_mistakes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  exercise_type TEXT NOT NULL,
  
  correct_answer TEXT NOT NULL,
  wrong_answer TEXT NOT NULL,
  occurrence_count INTEGER DEFAULT 1,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  
  UNIQUE(exercise_id, wrong_answer)
);

-- Daily error summary for analytics dashboard
CREATE TABLE IF NOT EXISTS daily_error_summary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  language TEXT,
  
  total_attempts INTEGER DEFAULT 0,
  total_errors INTEGER DEFAULT 0,
  unique_users INTEGER DEFAULT 0,
  
  -- Error breakdown by type
  spelling_errors INTEGER DEFAULT 0,
  grammar_errors INTEGER DEFAULT 0,
  vocabulary_errors INTEGER DEFAULT 0,
  listening_errors INTEGER DEFAULT 0,
  translation_errors INTEGER DEFAULT 0,
  
  -- Exercise type breakdown
  multiple_choice_errors INTEGER DEFAULT 0,
  translation_exercise_errors INTEGER DEFAULT 0,
  matching_errors INTEGER DEFAULT 0,
  fill_blank_errors INTEGER DEFAULT 0,
  listening_exercise_errors INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  
  UNIQUE(date, language)
);

-- ============================================
-- RLS POLICIES
-- ============================================

-- Exercise attempts - users see own, admins see all
ALTER TABLE exercise_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own attempts" ON exercise_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own attempts" ON exercise_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all attempts" ON exercise_attempts FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- User exercise stats - users see own, admins see all
ALTER TABLE user_exercise_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own stats" ON user_exercise_stats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own stats" ON user_exercise_stats FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all stats" ON user_exercise_stats FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- Common mistakes - admin only
ALTER TABLE common_mistakes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage common mistakes" ON common_mistakes FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- Daily error summary - admin only
ALTER TABLE daily_error_summary ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage daily summary" ON daily_error_summary FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_exercise_attempts_user ON exercise_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_exercise_attempts_exercise ON exercise_attempts(exercise_id);
CREATE INDEX IF NOT EXISTS idx_exercise_attempts_created ON exercise_attempts(created_at);
CREATE INDEX IF NOT EXISTS idx_exercise_attempts_language ON exercise_attempts(language);
CREATE INDEX IF NOT EXISTS idx_exercise_attempts_correct ON exercise_attempts(is_correct);

CREATE INDEX IF NOT EXISTS idx_user_exercise_stats_user ON user_exercise_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_common_mistakes_exercise ON common_mistakes(exercise_id);
CREATE INDEX IF NOT EXISTS idx_daily_error_summary_date ON daily_error_summary(date);

-- ============================================
-- HELPER FUNCTION TO LOG EXERCISE ATTEMPT
-- ============================================
CREATE OR REPLACE FUNCTION log_exercise_attempt(
  p_user_id UUID,
  p_exercise_id UUID,
  p_lesson_id UUID,
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
