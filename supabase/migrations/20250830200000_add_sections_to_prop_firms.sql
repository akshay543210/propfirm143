-- Add sections field to prop_firms table for section-based filtering
ALTER TABLE public.prop_firms 
ADD COLUMN sections JSONB DEFAULT '[]';

-- Create index for better performance on section queries
CREATE INDEX idx_prop_firms_sections ON public.prop_firms USING GIN (sections);

-- Update existing firms to have empty sections array (this is already the default)
UPDATE public.prop_firms 
SET sections = '[]' 
WHERE sections IS NULL;

-- Update RLS policies to allow public read access to sections field
-- (The existing policies already allow public read access, so no changes needed)
