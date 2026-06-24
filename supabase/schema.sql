-- TaskDock - Supabase Database Schema
-- Run this script inside the Supabase SQL Editor to set up the database.

-- Enable UUID extension if not already active
create extension if not exists "uuid-ossp";

-- =========================================================================
-- 1. Profiles Table
-- =========================================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =========================================================================
-- 2. Tasks Table
-- =========================================================================
create table public.tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  assigned_user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null check (char_length(title) >= 1 and char_length(title) <= 100),
  description text check (char_length(description) <= 1000),
  priority text check (priority in ('LOW', 'MEDIUM', 'HIGH')) default 'MEDIUM' not null,
  status text check (status in ('TO_DO', 'IN_PROGRESS', 'COMPLETED')) default 'TO_DO' not null,
  due_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =========================================================================
-- 3. Trigger for Automatic Profile Creation
-- =========================================================================
-- This trigger automatically inserts a record into the public.profiles table
-- whenever a new user registers using Supabase Auth.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger initialization
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =========================================================================
-- 4. Row Level Security (RLS) Configuration
-- =========================================================================

-- Enable RLS on Profiles and Tasks
alter table public.profiles enable row level security;
alter table public.tasks enable row level security;

-- Profiles Policies
create policy "Allow authenticated users to read profiles"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Allow users to update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

-- Tasks Policies
create policy "Allow users to view their own tasks"
  on public.tasks for select
  to authenticated
  using (auth.uid() = user_id or auth.uid() = assigned_user_id);

create policy "Allow users to insert their own tasks"
  on public.tasks for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Allow users to update their own tasks"
  on public.tasks for update
  to authenticated
  using (auth.uid() = user_id or auth.uid() = assigned_user_id);

create policy "Allow users to delete their own tasks"
  on public.tasks for delete
  to authenticated
  using (auth.uid() = user_id);

-- =========================================================================
-- 5. Performance Indexes
-- =========================================================================
-- Create indexes to optimize queries on frequent search, filter, and sort keys.
create index tasks_user_id_idx on public.tasks (user_id);
create index tasks_assigned_user_id_idx on public.tasks (assigned_user_id);
create index tasks_status_idx on public.tasks (status);
create index tasks_priority_idx on public.tasks (priority);
create index tasks_due_date_idx on public.tasks (due_date);
