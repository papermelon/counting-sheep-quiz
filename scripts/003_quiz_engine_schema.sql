-- Enhanced quiz engine schema
-- Core entities for reusable quiz system

-- Drop existing tables if they exist (for migration)
DROP TABLE IF EXISTS quiz_submissions CASCADE;
DROP TABLE IF EXISTS quiz_questions CASCADE;
DROP TABLE IF EXISTS quizzes CASCADE;

-- Core quiz definitions
CREATE TABLE IF NOT EXISTS quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,        -- 'epworth' | 'stopbang' | 'psqi'
  title text NOT NULL,
  description text,
  max_score int NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Quiz questions with flexible options
CREATE TABLE IF NOT EXISTS quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid REFERENCES quizzes(id) ON DELETE CASCADE,
  order_index int NOT NULL,
  prompt text NOT NULL,
  question_type text NOT NULL DEFAULT 'radio', -- 'radio' | 'select' | 'checkbox'
  -- JSON options: [{value:int|string,label:string,score:int}]
  options jsonb NOT NULL,
  required boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Quiz submissions with enhanced tracking
CREATE TABLE IF NOT EXISTS quiz_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid REFERENCES quizzes(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  session_id text,                  -- for anonymous users
  referral_code text,
  score int NOT NULL,
  interpretation text NOT NULL,
  tips text[],                      -- array of strings selected by rules
  answers jsonb NOT NULL,
  shared_token text UNIQUE,         -- for shareable URLs
  completed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Progress tracking for in-progress quizzes
CREATE TABLE IF NOT EXISTS quiz_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid REFERENCES quizzes(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  session_id text,                  -- for anonymous users
  current_question int DEFAULT 0,
  answers jsonb DEFAULT '{}',
  referral_code text,
  started_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(quiz_id, user_id),
  UNIQUE(quiz_id, session_id)
);

-- RLS Policies
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_progress ENABLE ROW LEVEL SECURITY;

-- Public read access for quiz definitions
CREATE POLICY "read quizzes public" ON quizzes FOR SELECT USING (true);
CREATE POLICY "read questions public" ON quiz_questions FOR SELECT USING (true);

-- Quiz submissions policies
CREATE POLICY "insert submissions anon or user" ON quiz_submissions
FOR INSERT WITH CHECK (true);

CREATE POLICY "select own submissions" ON quiz_submissions
FOR SELECT USING (auth.uid() = user_id OR session_id IS NOT NULL);

CREATE POLICY "select by shared token" ON quiz_submissions
FOR SELECT USING (shared_token IS NOT NULL);

-- Quiz progress policies
CREATE POLICY "manage own progress" ON quiz_progress
FOR ALL USING (auth.uid() = user_id OR session_id IS NOT NULL);

-- Seed quiz definitions
INSERT INTO quizzes (slug, title, description, max_score) VALUES
('epworth', 'Epworth Sleepiness Scale', 'Measures daytime sleepiness and likelihood of falling asleep in various situations', 24),
('stopbang', 'STOP-BANG Assessment', 'Screening tool for obstructive sleep apnea risk assessment', 8),
('psqi', 'Pittsburgh Sleep Quality Index', 'Comprehensive assessment of sleep quality over the past month', 21)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  max_score = EXCLUDED.max_score;
