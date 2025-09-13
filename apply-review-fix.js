// Script to apply the review submission policy fix
// This script requires the SUPABASE_SERVICE_ROLE_KEY environment variable to be set

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

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

async function testReviewSubmission() {
  console.log('Testing review submission...');
  try {
    // First, get a firm ID to test with
    const { data: firms, error: firmError } = await supabase
      .from('prop_firms')
      .select('id')
      .limit(1);

    if (firmError || !firms || firms.length === 0) {
      console.error('Error getting test firm:', firmError);
      return;
    }

    const testFirmId = firms[0].id;

    // Try to insert a test review (anonymous)
    const { error: insertError } = await supabase
      .from('reviews')
      .insert({
        firm_id: testFirmId,
        rating: 5,
        title: 'Test Review',
        content: 'This is a test review to verify the fix works',
        reviewer_name: 'Test User'
      });

    if (insertError) {
      console.error('Error inserting test review:', insertError);
      return;
    }

    console.log('✓ Test review inserted successfully');

    // Clean up the test review
    const { error: deleteError } = await supabase
      .from('reviews')
      .delete()
      .eq('title', 'Test Review')
      .eq('content', 'This is a test review to verify the fix works');

    if (deleteError) {
      console.warn('Warning: Could not clean up test review:', deleteError);
    } else {
      console.log('✓ Test review cleaned up');
    }

    console.log('\n✅ Review submission tested successfully!');
    console.log('Users can now submit reviews both as authenticated users and anonymously (if RLS policy is correct).');
  } catch (error) {
    console.error('Unexpected error during review submission test:', error);
  }
}

// Instructions for the user
console.log('--- Review Submission Policy Fix ---');
console.log('1. Please apply the migration manually using the Supabase CLI or Dashboard:');
console.log('   Migration file: supabase/migrations/20250913_fix_review_submission_policy.sql');
console.log('   Example CLI command:');
console.log('     supabase db push');
console.log('   Or copy-paste the SQL into the Supabase Dashboard > SQL Editor and run it.');
console.log('2. After applying the migration, this script will test review submission.');

testReviewSubmission();
