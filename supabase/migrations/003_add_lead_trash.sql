-- Create migration to support soft deletes (Move to Trash), restore, and permanent deletion of leads.

-- 1. Add soft-delete fields to public.leads
alter table public.leads
add column if not exists deleted_at timestamptz,
add column if not exists deleted_by uuid;

-- 2. Add partial indexes to optimize active and trashed leads list queries
create index if not exists leads_active_created_at_idx
on public.leads (created_at desc)
where deleted_at is null;

create index if not exists leads_trashed_deleted_at_idx
on public.leads (deleted_at desc)
where deleted_at is not null;
