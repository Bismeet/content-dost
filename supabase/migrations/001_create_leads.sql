-- Create public.leads table with strict validation constraints
CREATE TABLE IF NOT EXISTS public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  profile_url text,
  budget text NOT NULL,
  needs text[] NOT NULL,
  project_details text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  internal_notes text NOT NULL DEFAULT '',
  source text NOT NULL DEFAULT 'website',
  ip_hash text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  -- CHECK constraints matching shared/lead-constants.ts
  CONSTRAINT name_length CHECK (
    char_length(trim(name)) > 0 AND char_length(name) <= 120
  ),
  CONSTRAINT email_length CHECK (
    char_length(trim(email)) > 0 AND char_length(email) <= 254 AND email = lower(email)
  ),
  CONSTRAINT company_length CHECK (
    company IS NULL OR (char_length(trim(company)) > 0 AND char_length(company) <= 160)
  ),
  CONSTRAINT profile_url_length CHECK (
    profile_url IS NULL OR (char_length(profile_url) <= 2048)
  ),
  CONSTRAINT budget_val CHECK (
    budget IN ('<1500', '1500-3000', '3000-5000', '>5000')
  ),
  CONSTRAINT needs_val CHECK (
    cardinality(needs) >= 1 AND 
    cardinality(needs) <= 6 AND
    needs <@ ARRAY[
      'Content Strategy',
      'Scriptwriting',
      'Long-Form Editing',
      'Shorts & Reels',
      'Podcast Production',
      'Visual Packaging (Thumbnails)'
    ]::text[]
  ),
  CONSTRAINT project_details_length CHECK (
    char_length(trim(project_details)) > 0 AND char_length(project_details) <= 5000
  ),
  CONSTRAINT status_val CHECK (
    status IN ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost', 'spam', 'archived')
  ),
  CONSTRAINT internal_notes_length CHECK (
    char_length(internal_notes) <= 5000
  ),
  CONSTRAINT source_length CHECK (
    char_length(trim(source)) > 0 AND char_length(source) <= 50
  ),
  CONSTRAINT user_agent_length CHECK (
    user_agent IS NULL OR char_length(user_agent) <= 512
  )
);

-- Add indexes for optimized queries and searches
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS leads_status_idx ON public.leads(status);
CREATE INDEX IF NOT EXISTS leads_email_idx ON public.leads(email);
CREATE INDEX IF NOT EXISTS leads_status_created_at_idx ON public.leads(status, created_at DESC);

-- Automatic updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS trigger_update_leads ON public.leads;
CREATE TRIGGER trigger_update_leads
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Note: No public policies (SELECT, INSERT, UPDATE, DELETE) are created.
-- All operations will be handled by the serverless API via the service-role client.
