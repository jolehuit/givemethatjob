/*
  # Add video recordings support
  
  1. New Tables
    - video_recordings
      - id (uuid, primary key)
      - interview_id (uuid, references interviews)
      - recording_url (text)
      - created_at (timestamp)
      - analysis_status (text)
      - analysis_result (jsonb)
      
  2. Changes
    - Add duration_minutes to interviews table
    
  3. Security
    - Enable RLS on video_recordings
    - Add policies for user access
*/

-- Create video_recordings table
CREATE TABLE video_recordings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  interview_id UUID REFERENCES interviews(id) ON DELETE CASCADE NOT NULL,
  recording_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  analysis_status TEXT NOT NULL DEFAULT 'pending',
  analysis_result JSONB
);

-- Add duration to interviews
ALTER TABLE interviews 
ADD COLUMN duration_minutes INTEGER NOT NULL DEFAULT 30;

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