-- Migration: Remove budget field from public.leads
-- Run this migration in Supabase SQL editor to drop the budget column and its constraint.
-- WARNING: Running this migration permanently deletes all previously stored budget values.

-- 1. Remove the budget CHECK constraint safely
ALTER TABLE public.leads
DROP CONSTRAINT IF EXISTS budget_val;

-- 2. Drop the budget column from public.leads table
ALTER TABLE public.leads
DROP COLUMN IF EXISTS budget;
