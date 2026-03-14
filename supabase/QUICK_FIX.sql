-- QUICK FIX: Disable RLS on profiles temporarily to fix infinite recursion
-- Run this in Supabase SQL Editor

-- Step 1: Disable RLS on profiles (temporary fix)
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Step 2: Manually insert your profile if it doesn't exist
-- Replace the UUID and email with your actual values from the debug page
INSERT INTO profiles (id, email, role)
VALUES (
  'f7312337-785c-4321-9c5a-358d9de0cc03',  -- Your user ID from debug page
  'takacsmatyas77@gmail.com',               -- Your email
  'admin'                                    -- Set as admin
)
ON CONFLICT (id) DO UPDATE 
SET role = 'admin';

-- Step 3: Verify it worked
SELECT id, email, role FROM profiles WHERE email = 'takacsmatyas77@gmail.com';

-- You should see your profile with role = 'admin'
-- Now try accessing /admin/events again!
