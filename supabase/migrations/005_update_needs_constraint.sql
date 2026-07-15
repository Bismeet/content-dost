-- Migration: Update needs_val CHECK constraint on public.leads
-- Run this migration in your Supabase SQL Editor to update the allowed service needs in the database.

-- 1. Remove the old needs CHECK constraint
ALTER TABLE public.leads
DROP CONSTRAINT IF EXISTS needs_val;

-- 2. Add the updated needs CHECK constraint matching the new SERVICE_NAMES
ALTER TABLE public.leads
ADD CONSTRAINT needs_val CHECK (
  cardinality(needs) >= 1 AND 
  cardinality(needs) <= 6 AND
  needs <@ ARRAY[
    'Content Strategy',
    'Scriptwriting',
    'Video Editing',
    'Brand Management',
    'Website Making'
  ]::text[]
);
