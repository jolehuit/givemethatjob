/*
  # Add completed_at column to interviews table

  1. Changes
    - Add completed_at timestamp column to interviews table
*/

ALTER TABLE interviews
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;