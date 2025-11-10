/*
  # Movie Watchlist App Database Schema

  ## Overview
  This migration creates the complete database schema for the Movie Watchlist application,
  including tables for user profiles, watchlists, watched movies, and user preferences.

  ## New Tables

  ### 1. profiles
  Extended user profile information beyond Supabase Auth
  - `id` (uuid, primary key) - References auth.users(id)
  - `username` (text, unique) - User's display name
  - `created_at` (timestamptz) - Account creation timestamp

  ### 2. watchlist
  Movies saved to user's watchlist
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, foreign key) - References auth.users(id)
  - `movie_id` (integer) - TMDB movie ID
  - `title` (text) - Movie title
  - `poster_path` (text) - TMDB poster image path
  - `release_year` (text) - Year of release
  - `genres` (text array) - Movie genres
  - `synopsis` (text) - Movie overview/description
  - `added_date` (timestamptz) - When movie was added to watchlist

  ### 3. watched_movies
  Movies the user has watched and rated
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, foreign key) - References auth.users(id)
  - `movie_id` (integer) - TMDB movie ID
  - `title` (text) - Movie title
  - `poster_path` (text) - TMDB poster image path
  - `release_year` (text) - Year of release
  - `genres` (text array) - Movie genres
  - `synopsis` (text) - Movie overview/description
  - `rating` (numeric) - User's rating (0.5 to 5.0 with half-star increments)
  - `watched_date` (timestamptz) - When movie was marked as watched

  ### 4. user_preferences
  Stores user preferences including movies they're not interested in
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, foreign key, unique) - References auth.users(id)
  - `not_interested_movies` (integer array) - TMDB movie IDs user is not interested in
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security

  ### Row Level Security (RLS)
  - All tables have RLS enabled
  - Users can only access their own data
  - Policies enforce authentication and ownership checks

  ### RLS Policies

  #### profiles table
  - Users can view their own profile
  - Users can insert their own profile (during signup)
  - Users can update their own profile

  #### watchlist table
  - Users can view their own watchlist items
  - Users can insert items to their own watchlist
  - Users can update their own watchlist items
  - Users can delete their own watchlist items

  #### watched_movies table
  - Users can view their own watched movies
  - Users can insert to their own watched movies
  - Users can update their own watched movie ratings
  - Users can delete their own watched movies

  #### user_preferences table
  - Users can view their own preferences
  - Users can insert their own preferences
  - Users can update their own preferences

  ## Indexes
  - Index on watchlist(user_id, movie_id) for efficient lookups
  - Index on watched_movies(user_id, movie_id) for efficient lookups
  - Index on watched_movies(rating) for filtering high-rated movies
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE TABLE IF NOT EXISTS watchlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  movie_id integer NOT NULL,
  title text NOT NULL,
  poster_path text,
  release_year text,
  genres text[],
  synopsis text,
  added_date timestamptz DEFAULT now()
);

ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own watchlist"
  ON watchlist FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert to own watchlist"
  ON watchlist FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own watchlist"
  ON watchlist FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from own watchlist"
  ON watchlist FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_watchlist_user_movie ON watchlist(user_id, movie_id);

CREATE TABLE IF NOT EXISTS watched_movies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  movie_id integer NOT NULL,
  title text NOT NULL,
  poster_path text,
  release_year text,
  genres text[],
  synopsis text,
  rating numeric(2, 1) NOT NULL CHECK (rating >= 0.5 AND rating <= 5.0),
  watched_date timestamptz DEFAULT now()
);

ALTER TABLE watched_movies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own watched movies"
  ON watched_movies FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert to own watched movies"
  ON watched_movies FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own watched movies"
  ON watched_movies FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from own watched movies"
  ON watched_movies FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_watched_movies_user_movie ON watched_movies(user_id, movie_id);
CREATE INDEX IF NOT EXISTS idx_watched_movies_rating ON watched_movies(rating);

CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  not_interested_movies integer[] DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
