-- Create tables for the Counting Sheep sleep assessment app

-- Users table for optional email login (references auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Assessment results table
CREATE TABLE IF NOT EXISTS public.assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL, -- For anonymous users
  assessment_type TEXT NOT NULL CHECK (assessment_type IN ('epworth', 'stop_bang', 'psqi')),
  score INTEGER NOT NULL,
  interpretation TEXT NOT NULL,
  answers JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  referral_code TEXT
);

ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own results
CREATE POLICY "results_select_own" ON public.assessment_results FOR SELECT 
USING (auth.uid() = user_id OR (user_id IS NULL AND session_id = current_setting('app.session_id', true)));

-- Allow users to insert their own results
CREATE POLICY "results_insert_own" ON public.assessment_results FOR INSERT 
WITH CHECK (auth.uid() = user_id OR (user_id IS NULL AND session_id = current_setting('app.session_id', true)));

-- Allow users to update their own results
CREATE POLICY "results_update_own" ON public.assessment_results FOR UPDATE 
USING (auth.uid() = user_id OR (user_id IS NULL AND session_id = current_setting('app.session_id', true)));

-- Recommendations table (editable by admin)
CREATE TABLE IF NOT EXISTS public.recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_type TEXT NOT NULL CHECK (assessment_type IN ('epworth', 'stop_bang', 'psqi', 'combined')),
  score_range_min INTEGER,
  score_range_max INTEGER,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  severity_level TEXT NOT NULL CHECK (severity_level IN ('low', 'moderate', 'high', 'severe')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Public read access for recommendations
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "recommendations_select_all" ON public.recommendations FOR SELECT TO PUBLIC USING (true);

-- Referral codes table for sharing
CREATE TABLE IF NOT EXISTS public.referral_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  usage_count INTEGER DEFAULT 0
);

ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "referral_codes_select_all" ON public.referral_codes FOR SELECT TO PUBLIC USING (true);
CREATE POLICY "referral_codes_insert_own" ON public.referral_codes FOR INSERT WITH CHECK (auth.uid() = created_by);
