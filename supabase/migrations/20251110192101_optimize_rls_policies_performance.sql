/*
  # Optimize RLS Policies for Performance

  ## Overview
  This migration optimizes all Row Level Security policies by replacing direct
  `auth.uid()` calls with `(select auth.uid())` to prevent re-evaluation on each row.

  ## Tables Updated
  1. **profiles** - 3 policies optimized
     - Users can view own profile (SELECT)
     - Users can insert own profile (INSERT)
     - Users can update own profile (UPDATE)

  2. **watchlist** - 4 policies optimized
     - Users can view own watchlist (SELECT)
     - Users can insert to own watchlist (INSERT)
     - Users can update own watchlist (UPDATE)
     - Users can delete from own watchlist (DELETE)

  3. **watched_movies** - 4 policies optimized
     - Users can view own watched movies (SELECT)
     - Users can insert to own watched movies (INSERT)
     - Users can update own watched movies (UPDATE)
     - Users can delete from own watched movies (DELETE)

  4. **user_preferences** - 3 policies optimized
     - Users can view own preferences (SELECT)
     - Users can insert own preferences (INSERT)
     - Users can update own preferences (UPDATE)

  ## Performance Impact
  - Reduces function re-evaluation overhead
  - Improves query performance at scale
  - auth.uid() is now evaluated once per query instead of once per row

  ## Security Notes
  - No security changes - same access control maintained
  - Only performance optimization applied
  - All policies remain restrictive (users can only access their own data)
*/

-- ============================================================================
-- PROFILES TABLE POLICIES
-- ============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Recreate with optimized auth.uid() calls
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

-- ============================================================================
-- WATCHLIST TABLE POLICIES
-- ============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own watchlist" ON watchlist;
DROP POLICY IF EXISTS "Users can insert to own watchlist" ON watchlist;
DROP POLICY IF EXISTS "Users can update own watchlist" ON watchlist;
DROP POLICY IF EXISTS "Users can delete from own watchlist" ON watchlist;

-- Recreate with optimized auth.uid() calls
CREATE POLICY "Users can view own watchlist"
  ON watchlist
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert to own watchlist"
  ON watchlist
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own watchlist"
  ON watchlist
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete from own watchlist"
  ON watchlist
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- WATCHED_MOVIES TABLE POLICIES
-- ============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own watched movies" ON watched_movies;
DROP POLICY IF EXISTS "Users can insert to own watched movies" ON watched_movies;
DROP POLICY IF EXISTS "Users can update own watched movies" ON watched_movies;
DROP POLICY IF EXISTS "Users can delete from own watched movies" ON watched_movies;

-- Recreate with optimized auth.uid() calls
CREATE POLICY "Users can view own watched movies"
  ON watched_movies
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert to own watched movies"
  ON watched_movies
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own watched movies"
  ON watched_movies
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete from own watched movies"
  ON watched_movies
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- USER_PREFERENCES TABLE POLICIES
-- ============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can insert own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can update own preferences" ON user_preferences;

-- Recreate with optimized auth.uid() calls
CREATE POLICY "Users can view own preferences"
  ON user_preferences
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);
