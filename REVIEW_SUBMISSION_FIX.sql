-- Enable RLS on the reviews table
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow authenticated users to create reviews
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'reviews' 
    AND policyname = 'Allow authenticated review submissions'
  ) THEN
    CREATE POLICY "Allow authenticated review submissions" ON public.reviews
      FOR INSERT 
      TO authenticated
      WITH CHECK (true);
    RAISE NOTICE '✅ Created authenticated user review submission policy';
  END IF;
END $$;

-- Create a policy to allow anonymous users to create reviews
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'reviews' 
    AND policyname = 'Allow anonymous review submissions'
  ) THEN
    CREATE POLICY "Allow anonymous review submissions" ON public.reviews
      FOR INSERT 
      TO anon
      WITH CHECK (true);
    RAISE NOTICE '✅ Created anonymous review submission policy';
  END IF;
END $$;

-- Create a policy to allow everyone to read reviews
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'reviews' 
    AND policyname = 'Public read access for reviews'
  ) THEN
    CREATE POLICY "Public read access for reviews" ON public.reviews
      FOR SELECT USING (true);
    RAISE NOTICE '✅ Created public read policy for reviews';
  END IF;
END $$;

-- Grant necessary permissions to authenticated and anonymous roles
GRANT SELECT, INSERT ON public.reviews TO authenticated;
GRANT SELECT, INSERT ON public.reviews TO anon;
GRANT USAGE ON SEQUENCE reviews_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE reviews_id_seq TO anon;