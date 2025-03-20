/*
  # Create attractions and reviews tables

  1. New Tables
    - `attractions`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `image` (text)
      - `latitude` (double precision)
      - `longitude` (double precision)
      - `address` (text)
      - `city` (text)
      - `state` (text)
      - `rating` (double precision)
      - `category` (text)
      - `created_at` (timestamptz)
      
    - `reviews`
      - `id` (uuid, primary key)
      - `attraction_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `rating` (integer)
      - `comment` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for:
      - Public read access to attractions
      - Authenticated users can create reviews
      - Users can only modify their own reviews
*/

-- Create attractions table
CREATE TABLE attractions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  image text,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  address text,
  city text NOT NULL,
  state text NOT NULL,
  rating double precision DEFAULT 0,
  category text,
  created_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attraction_id uuid REFERENCES attractions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE attractions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policies for attractions
CREATE POLICY "Allow public read access to attractions"
  ON attractions
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to create attractions"
  ON attractions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policies for reviews
CREATE POLICY "Allow public read access to reviews"
  ON reviews
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to create reviews"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow users to update their own reviews"
  ON reviews
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own reviews"
  ON reviews
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);