-- 0001_initial_schema.sql
-- Supabase CMS schema for portfolio

-- Enable UUID extension if needed (kept for future use)
-- create extension if not exists "uuid-ossp";

-- Common updated_at trigger function
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- SITE SETTINGS (single-row table, id must be 1)
create table if not exists public.site_settings (
  id          smallint primary key check (id = 1),
  site_title  text,
  site_description text,
  seo_keywords text[],
  og_image_url text,
  twitter_handle text,
  github_url text,
  linkedin_url text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger site_settings_set_updated_at
before update on public.site_settings
for each row
execute function handle_updated_at();

-- HERO SECTION (single-row table, id must be 1)
create table if not exists public.hero_section (
  id           smallint primary key check (id = 1),
  greeting     text,
  name         text,
  headline     text,
  subheadline  text,
  roles        text[],           -- for typing/rotating roles
  avatar_url   text,
  cta_primary_label text,
  cta_primary_href  text,
  cta_secondary_label text,
  cta_secondary_href  text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create trigger hero_section_set_updated_at
before update on public.hero_section
for each row
execute function handle_updated_at();

-- STATS
create table if not exists public.stats (
  id          bigserial primary key,
  label       text not null,
  value       numeric not null,
  suffix      text,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists stats_sort_order_idx
  on public.stats(sort_order asc, id asc);

create trigger stats_set_updated_at
before update on public.stats
for each row
execute function handle_updated_at();

-- SKILLS
create table if not exists public.skills (
  id          bigserial primary key,
  name        text not null,
  category    text,              -- e.g. "frontend", "backend", "tools"
  level       text,              -- e.g. "Beginner", "Intermediate", "Advanced"
  icon_url    text,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists skills_sort_order_idx
  on public.skills(category asc nulls last, sort_order asc, id asc);

create trigger skills_set_updated_at
before update on public.skills
for each row
execute function handle_updated_at();

-- APPROACHES (work process / philosophy)
create table if not exists public.approaches (
  id          bigserial primary key,
  title       text not null,
  subtitle    text,
  description text,
  icon        text,              -- optional icon name or URL
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists approaches_sort_order_idx
  on public.approaches(sort_order asc, id asc);

create trigger approaches_set_updated_at
before update on public.approaches
for each row
execute function handle_updated_at();

-- EXPERIENCES (work history)
create table if not exists public.experiences (
  id             bigserial primary key,
  company        text not null,
  role           text not null,
  location       text,
  start_date     date not null,
  end_date       date,
  is_current     boolean not null default false,
  description    text,
  highlights     text[],        -- bullet points
  technologies   text[],
  sort_order     integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists experiences_sort_order_idx
  on public.experiences(sort_order asc, start_date desc, id asc);

create trigger experiences_set_updated_at
before update on public.experiences
for each row
execute function handle_updated_at();

-- PROJECTS
create table if not exists public.projects (
  id             bigserial primary key,
  slug           text not null unique,
  title          text not null,
  short_description text,
  description    text,
  thumbnail_url  text,
  repo_url       text,
  live_url       text,
  tags           text[],
  featured       boolean not null default false,
  sort_order     integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists projects_featured_idx
  on public.projects(featured desc, sort_order asc, id asc);

create trigger projects_set_updated_at
before update on public.projects
for each row
execute function handle_updated_at();

-- RLS: enable and allow public SELECT for all content tables
alter table public.site_settings enable row level security;
alter table public.hero_section enable row level security;
alter table public.stats enable row level security;
alter table public.skills enable row level security;
alter table public.approaches enable row level security;
alter table public.experiences enable row level security;
alter table public.projects enable row level security;

-- Public (anon) read-only access
create policy "Public read site_settings"
  on public.site_settings
  for select
  to anon
  using (true);

create policy "Public read hero_section"
  on public.hero_section
  for select
  to anon
  using (true);

create policy "Public read stats"
  on public.stats
  for select
  to anon
  using (true);

create policy "Public read skills"
  on public.skills
  for select
  to anon
  using (true);

create policy "Public read approaches"
  on public.approaches
  for select
  to anon
  using (true);

create policy "Public read experiences"
  on public.experiences
  for select
  to anon
  using (true);

create policy "Public read projects"
  on public.projects
  for select
  to anon
  using (true);

