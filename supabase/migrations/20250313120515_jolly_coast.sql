/*
  # Add details to attractions table

  1. Changes
    - Add columns to attractions table:
      - `admission_fee` (text) - Price information or "Free"
      - `opening_hours` (text) - Operating hours
      - `website` (text) - Official website URL
*/

-- Add new columns to attractions table
ALTER TABLE attractions 
ADD COLUMN IF NOT EXISTS admission_fee text,
ADD COLUMN IF NOT EXISTS opening_hours text,
ADD COLUMN IF NOT EXISTS website text;

-- Update existing attractions with new information
UPDATE attractions SET
  admission_fee = CASE name
    WHEN 'Statue of Liberty' THEN '$23.50 for adults, $12 for children (4-12)'
    WHEN 'Golden Gate Bridge' THEN 'Free for pedestrians and cyclists'
    WHEN 'Times Square' THEN 'Free'
    WHEN 'Grand Canyon' THEN '$35 per vehicle, valid for 7 days'
    WHEN 'Walt Disney World' THEN 'Starting at $109 per day'
  END,
  opening_hours = CASE name
    WHEN 'Statue of Liberty' THEN '9:00 AM - 5:00 PM daily'
    WHEN 'Golden Gate Bridge' THEN '24/7'
    WHEN 'Times Square' THEN '24/7'
    WHEN 'Grand Canyon' THEN '24/7'
    WHEN 'Walt Disney World' THEN '9:00 AM - 9:00 PM daily'
  END,
  website = CASE name
    WHEN 'Statue of Liberty' THEN 'https://www.nps.gov/stli/'
    WHEN 'Golden Gate Bridge' THEN 'https://www.goldengate.org/'
    WHEN 'Times Square' THEN 'https://www.timessquarenyc.org/'
    WHEN 'Grand Canyon' THEN 'https://www.nps.gov/grca/'
    WHEN 'Walt Disney World' THEN 'https://disneyworld.disney.go.com/'
  END;