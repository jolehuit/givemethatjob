-- Create tables and set up initial schema for GiveMeThatJob

-- Profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  interviews_completed INTEGER DEFAULT 0,
  average_score FLOAT DEFAULT 0,
  subscription_tier TEXT DEFAULT 'free',
  subscription_start_date TIMESTAMP WITH TIME ZONE,
  subscription_end_date TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on the profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Trigger can create user profile"
  ON profiles FOR INSERT
  WITH CHECK (true);

-- Interviews table
CREATE TABLE interviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  job_url TEXT NOT NULL,
  job_title TEXT NOT NULL,
  company TEXT NOT NULL,
  cv_path TEXT,
  interview_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_progress',
  score FLOAT DEFAULT 0
);

-- Enable RLS on the interviews table
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;

-- Policies for interviews
CREATE POLICY "Users can view their own interviews"
  ON interviews FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create interviews"
  ON interviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own interviews"
  ON interviews FOR UPDATE
  USING (auth.uid() = user_id);

-- Questions table
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  interview_id UUID REFERENCES interviews(id) ON DELETE CASCADE NOT NULL,
  question_text TEXT NOT NULL,
  answer_text TEXT,
  asked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  answered_at TIMESTAMP WITH TIME ZONE,
  score FLOAT,
  feedback TEXT
);

-- Enable RLS on the questions table
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Policies for questions
CREATE POLICY "Users can view questions for their interviews"
  ON questions FOR SELECT
  USING (auth.uid() IN (
    SELECT user_id FROM interviews WHERE id = questions.interview_id
  ));

CREATE POLICY "Users can create questions for their interviews"
  ON questions FOR INSERT
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM interviews WHERE id = questions.interview_id
  ));

-- Feedback table
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  interview_id UUID REFERENCES interviews(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  overall_score FLOAT NOT NULL,
  strengths TEXT[] NOT NULL,
  weaknesses TEXT[] NOT NULL,
  verbal_communication FLOAT NOT NULL,
  non_verbal_communication FLOAT NOT NULL,
  content_quality FLOAT NOT NULL,
  question_understanding FLOAT NOT NULL,
  improvement_suggestions TEXT NOT NULL
);

-- Enable RLS on the feedback table
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Policies for feedback
CREATE POLICY "Users can view feedback for their interviews"
  ON feedback FOR SELECT
  USING (auth.uid() IN (
    SELECT user_id FROM interviews WHERE id = feedback.interview_id
  ));

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('cvs', 'CVs and Resumes', false);

-- Storage policies
CREATE POLICY "Users can upload their own CVs"
  ON storage.objects FOR INSERT
  WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can access their own CVs"
  ON storage.objects FOR SELECT
  USING (auth.uid()::text = (storage.foldername(name))[1]);

-- Create functions for user registration
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (new.id, new.raw_user_meta_data->>'name', new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();