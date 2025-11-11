/*
  # Create Movie Reviews Table

  1. New Tables
    - `movie_reviews`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `movie_id` (integer, TMDB movie ID)
      - `title` (text, movie title)
      - `poster_path` (text, movie poster)
      - `rating` (numeric, 0.5 to 5.0 with 0.5 increments)
      - `review_text` (text, user's review comments)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `movie_reviews` table
    - Add policy for users to read their own reviews
    - Add policy for users to insert their own reviews
    - Add policy for users to update their own reviews
    - Add policy for users to delete their own reviews
*/

-- Create movie_reviews table
CREATE TABLE IF NOT EXISTS movie_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  movie_id integer NOT NULL,
  title text NOT NULL,
  poster_path text,
  rating numeric(2,1) CHECK (rating >= 0.5 AND rating <= 5.0) NOT NULL,
  review_text text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, movie_id)
);

-- Enable RLS
ALTER TABLE movie_reviews ENABLE ROW LEVEL SECURITY;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_movie_reviews_user_id ON movie_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_movie_reviews_movie_id ON movie_reviews(movie_id);

-- RLS Policies
CREATE POLICY "Users can view own reviews"
  ON movie_reviews FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reviews"
  ON movie_reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON movie_reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
  ON movie_reviews FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_movie_reviews_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER movie_reviews_updated_at
  BEFORE UPDATE ON movie_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_movie_reviews_updated_at();