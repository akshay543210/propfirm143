// Script to apply the sections migration to the prop_firms table
// This script requires the SUPABASE_SERVICE_ROLE_KEY environment variable to be set

const { createClient } = require('@supabase/supabase-js');

// Configuration - you need to set these environment variables
const SUPABASE_URL = process.env.SUPABASE_URL || "https://wiqcawxfidobsbfgpboa.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
 console.error('Error: SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  console.error('Please get this key from your Supabase project dashboard under Settings > API');
  process.exit(1);
}

// Create a Supabase client with service role key (admin privileges)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
  },
});

async function applyMigration() {
  console.log('Applying sections migration to prop_firms table...');
  
  try {
    // 1. Add sections field to prop_firms table
    console.log('1. Adding sections column to prop_firms table...');
    const { error: alterError } = await supabase.rpc('execute_sql', {
      sql: `
        ALTER TABLE public.prop_firms 
        ADD COLUMN IF NOT EXISTS sections JSONB DEFAULT '[]'
      `
    });
    
    if (alterError) {
      console.error('Error adding sections column:', alterError);
      return;
    }
    
    console.log('✓ Sections column added successfully');
    
    // 2. Create index for better performance on section queries
    console.log('2. Creating index on sections column...');
    const { error: indexError } = await supabase.rpc('execute_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_prop_firms_sections 
        ON public.prop_firms USING GIN (sections)
      `
    });
    
    if (indexError) {
      console.error('Error creating index:', indexError);
      return;
    }
    
    console.log('✓ Index created successfully');
    
    // 3. Update existing firms to have empty sections array
    console.log('3. Updating existing firms with empty sections array...');
    const { error: updateError } = await supabase.rpc('execute_sql', {
      sql: `
        UPDATE public.prop_firms 
        SET sections = '[]' 
        WHERE sections IS NULL
      `
    });
    
    if (updateError) {
      console.error('Error updating existing firms:', updateError);
      return;
    }
    
    console.log('✓ Existing firms updated successfully');
    
    console.log('\n✅ Migration applied successfully!');
    console.log('\nNext steps:');
    console.log('1. Restart your development server if it\'s running');
    console.log('2. Test the section-based filtering in your application');
    
  } catch (error) {
    console.error('Unexpected error during migration:', error);
 }
}

// Run the migration
applyMigration();
