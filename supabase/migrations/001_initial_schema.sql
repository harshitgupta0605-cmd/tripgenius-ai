-- =========================================================
-- TripGenius AI: Initial Database Schema (PostgreSQL/Supabase)
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT UNIQUE,
  avatar_url TEXT,
  preferred_currency TEXT DEFAULT 'USD',
  preferences JSONB DEFAULT '{"pace": "balanced", "dietary": [], "interests": []}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Trips Table
CREATE TABLE IF NOT EXISTS public.trips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  destination TEXT NOT NULL,
  origin TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  travelers INTEGER DEFAULT 1 NOT NULL,
  trip_type TEXT DEFAULT 'solo' NOT NULL,
  budget NUMERIC(12, 2) DEFAULT 0 NOT NULL,
  currency TEXT DEFAULT 'USD' NOT NULL,
  preferences JSONB DEFAULT '{}'::jsonb NOT NULL,
  itinerary_json JSONB NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'upcoming', 'ongoing', 'completed', 'archived')),
  is_public BOOLEAN DEFAULT false NOT NULL,
  share_token TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for Trips
CREATE INDEX IF NOT EXISTS trips_user_id_idx ON public.trips(user_id);
CREATE INDEX IF NOT EXISTS trips_destination_idx ON public.trips(destination);
CREATE INDEX IF NOT EXISTS trips_status_idx ON public.trips(status);
CREATE INDEX IF NOT EXISTS trips_share_token_idx ON public.trips(share_token);

-- 3. Saved Places Table
CREATE TABLE IF NOT EXISTS public.saved_places (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  trip_id UUID REFERENCES public.trips(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  destination TEXT NOT NULL,
  category TEXT DEFAULT 'attraction',
  notes TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  rating NUMERIC(2, 1),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS saved_places_user_id_idx ON public.saved_places(user_id);
CREATE INDEX IF NOT EXISTS saved_places_destination_idx ON public.saved_places(destination);

-- =========================================================
-- Row Level Security (RLS) Policies
-- =========================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_places ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Trips Policies
CREATE POLICY "Users can view their own trips or public trips" 
  ON public.trips FOR SELECT 
  USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can insert their own trips" 
  ON public.trips FOR INSERT 
  WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "Users can update their own trips" 
  ON public.trips FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trips" 
  ON public.trips FOR DELETE 
  USING (auth.uid() = user_id);

-- Saved Places Policies
CREATE POLICY "Users can view their own saved places" 
  ON public.saved_places FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved places" 
  ON public.saved_places FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved places" 
  ON public.saved_places FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved places" 
  ON public.saved_places FOR DELETE 
  USING (auth.uid() = user_id);

-- =========================================================
-- Triggers for updated_at timestamps
-- =========================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_modtime
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_trips_modtime
  BEFORE UPDATE ON public.trips
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger to auto-create profile on auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url, preferred_currency)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_user_meta_data->>'preferred_currency', 'USD')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
