-- LockIn2026 Database Schema
-- Run this in your Supabase SQL Editor to set up the database

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE commitment_status AS ENUM ('in_progress', 'completed', 'expired');

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  display_name TEXT,
  avatar_color TEXT
);

-- Sessions table (focus sessions)
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  mode TEXT NOT NULL,
  goal TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0 AND duration_minutes <= 480),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  focus_rating INTEGER CHECK (focus_rating >= 1 AND focus_rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Commitments table (public wall)
CREATE TABLE IF NOT EXISTS commitments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  alias TEXT NOT NULL,
  goal TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0 AND duration_minutes <= 480),
  status commitment_status DEFAULT 'in_progress',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_id UUID REFERENCES sessions(id) ON DELETE SET NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_commitments_created_at ON commitments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_commitments_status ON commitments(status);

-- Row Level Security (RLS)

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE commitments ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Sessions policies
CREATE POLICY "Users can view their own sessions"
  ON sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sessions"
  ON sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own sessions"
  ON sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Anonymous sessions can be created"
  ON sessions FOR INSERT
  WITH CHECK (user_id IS NULL);

-- Commitments policies (public - anyone can view and create)
CREATE POLICY "Anyone can view commitments"
  ON commitments FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can create commitments"
  ON commitments FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update commitment status"
  ON commitments FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Enable Realtime for commitments
ALTER PUBLICATION supabase_realtime ADD TABLE commitments;

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update commitment status based on time
CREATE OR REPLACE FUNCTION update_expired_commitments()
RETURNS void AS $$
BEGIN
  UPDATE commitments
  SET status = 'expired'
  WHERE status = 'in_progress'
    AND created_at + (duration_minutes * INTERVAL '1 minute') < NOW();
END;
$$ LANGUAGE plpgsql;

-- Optional: Create a scheduled job to update expired commitments
-- You can set this up via Supabase Dashboard > Database > Scheduled Jobs
-- Or use pg_cron if available:
-- SELECT cron.schedule('update-expired-commitments', '*/5 * * * *', 'SELECT update_expired_commitments()');
