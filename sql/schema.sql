-- ASL El Hekaya - Database Schema
-- Run this in Supabase SQL Editor

create extension if not exists "pgcrypto";

-- Categories table
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  created_at timestamp default now()
);

-- Videos table
create table videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text not null,
  content text not null,
  youtube_id text not null,
  thumbnail_url text,
  location text,
  people_involved text[],
  category_id uuid references categories(id) on delete set null,
  published_at timestamp default now(),
  updated_at timestamp default now(),
  created_at timestamp default now()
);

-- Contact messages table
create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  message text,
  created_at timestamp default now()
);

-- Enable Row Level Security
alter table videos enable row level security;
alter table categories enable row level security;
alter table contact_messages enable row level security;

-- Public read policies
create policy "Public read videos"
on videos for select
using (true);

create policy "Public read categories"
on categories for select
using (true);

-- Allow public to insert contact messages
create policy "Insert contact"
on contact_messages for insert
with check (true);

-- Admin full access policies
create policy "Admin full access videos"
on videos for all
using (auth.role() = 'authenticated');

create policy "Admin full access categories"
on categories for all
using (auth.role() = 'authenticated');

create policy "Admin read contact messages"
on contact_messages for select
using (auth.role() = 'authenticated');

create policy "Admin delete contact messages"
on contact_messages for delete
using (auth.role() = 'authenticated');
