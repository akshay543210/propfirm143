# Section Management Migration Instructions

This document provides instructions on how to apply the section management migration to your Supabase database.

## Prerequisites

1. Node.js installed on your system
2. The service role key from your Supabase project

## Getting the Service Role Key

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Find the "Service Role Key" (not the publishable key)
4. Copy this key - it will be used to run the migration

## Running the Migration

1. Install the required dependencies:
   ```bash
   npm install
   ```

2. Set the service role key as an environment variable and run the migration:
   ```bash
   # On Windows (Command Prompt)
   set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   npm run migrate
   
   # On Windows (PowerShell)
   $env:SUPABASE_SERVICE_ROLE_KEY="your_service_role_key_here"
   npm run migrate
   
   # On macOS/Linux
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here npm run migrate
   ```

   Replace `your_service_role_key_here` with your actual service role key.

## What the Migration Does

The migration script will:

1. Add a `sections` JSONB column to the `prop_firms` table with a default value of an empty array
2. Create a GIN index on the `sections` column for efficient querying
3. Update any existing firms to ensure they have an empty sections array

## Verification

After running the migration, you can verify it was successful by:

1. Checking your Supabase table editor to see the new `sections` column
2. Running a query in the Supabase SQL editor:
   ```sql
   SELECT * FROM prop_firms LIMIT 5;
   ```
   
   You should see the new `sections` column with empty arrays as default values.

## Troubleshooting

If you encounter any issues:

1. Ensure you're using the service role key, not the publishable key
2. Check that your Supabase project URL is correct
3. Verify you have internet connectivity to your Supabase project

If you continue to have issues, you can manually apply the migration using the Supabase SQL editor by running the SQL commands from `supabase/migrations/20250830200000_add_sections_to_prop_firms.sql`.
