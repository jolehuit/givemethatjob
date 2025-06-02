/*
  # Add language column to interviews table

  1. Changes
    - Add 'language' column to interviews table to store full language name
    - Update existing rows to set default language as 'English'

  2. Security
    - No changes to RLS policies needed
*/

ALTER TABLE interviews
ADD COLUMN IF NOT EXISTS language text NOT NULL DEFAULT 'English';