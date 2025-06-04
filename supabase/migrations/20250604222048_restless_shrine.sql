/*
  # Add video analysis support
  
  1. New Tables
    - video_recordings: Stores interview recording URLs and analysis results
    
  2. Changes
    - Add duration_minutes to interviews table
    - Add tavus_conversation_id to interviews table
    
  3. Security
    - Enable RLS on new tables
    - Add policies for user access and system updates
*/

-- Create video_recordings table
CREATE TABLE video_recordings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  interview_id UUID REFERENCES interviews(id) ON DELETE CASCADE NOT NULL,
  recording_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  analysis_status TEXT NOT NULL DEFAULT 'pending',
  analysis_result JSONB,
  verbal_score FLOAT,
  non_verbal_score FLOAT,
  content_score FLOAT,
  understanding_score FLOAT,
  strengths TEXT[],
  weaknesses TEXT[]
);

-- Add fields to interviews
ALTER TABLE interviews 
ADD COLUMN duration_minutes INTEGER NOT NULL DEFAULT 30,
ADD COLUMN tavus_conversation_id TEXT;

-- Enable RLS
ALTER TABLE video_recordings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own recordings"
  ON video_recordings FOR SELECT
  USING (auth.uid() IN (
    SELECT user_id FROM interviews WHERE id = video_recordings.interview_id
  ));

CREATE POLICY "System can create recordings"
  ON video_recordings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "System can update recordings"
  ON video_recordings FOR UPDATE
  USING (true);