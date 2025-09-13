-- Fix review submission policy to allow anonymous reviews
-- This migration fixes the issue where users cannot submit reviews due to restrictive RLS policies

-- Drop the existing restrictive INSERT policy for reviews
DROP POLICY IF EXISTS "Users can insert reviews" ON public.reviews;

-- Create a new policy that allows both authenticated and anonymous users to insert reviews
CREATE POLICY "Anyone can insert reviews" ON public.reviews
    FOR INSERT WITH CHECK (true);

-- Ensure the reviews table structure supports anonymous reviews
-- The user_id field should allow NULL values for anonymous reviews
ALTER TABLE public.reviews ALTER COLUMN user_id DROP NOT NULL;

-- Add a comment to document this change
COMMENT ON POLICY "Anyone can insert reviews" ON public.reviews IS 
'Allows both authenticated and anonymous users to submit reviews. Anonymous reviews will have user_id as NULL.';
