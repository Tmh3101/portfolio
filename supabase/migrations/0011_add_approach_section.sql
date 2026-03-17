-- 0011_add_approach_section.sql
-- Create table for approach section metadata

create table if not exists public.approach_section (
  id                  smallint primary key check (id = 1),
  eyebrow_vi          text,
  eyebrow_en          text,
  title1_vi           text,
  title1_en           text,
  title2_vi           text,
  title2_en           text,
  description_vi      text,
  description_en      text,
  note_label_vi       text,
  note_label_en       text,
  note_vi             text,
  note_en             text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Enable RLS
alter table public.approach_section enable row level security;

-- Public read access
create policy "Public read approach_section"
  on public.approach_section
  for select
  to anon
  using (true);

-- Admin full access for authenticated users
create policy "Admin full access on approach_section"
  on public.approach_section
  for all
  to authenticated
  using (true)
  with check (true);

-- Trigger for updated_at
create trigger approach_section_set_updated_at
before update on public.approach_section
for each row
execute function handle_updated_at();

-- Insert default row if not exists
insert into public.approach_section (
  id,
  eyebrow_vi, eyebrow_en,
  title1_vi, title1_en,
  title2_vi, title2_en,
  description_vi, description_en,
  note_label_vi, note_label_en,
  note_vi, note_en
)
values (
  1,
  'About', 'About',
  'Tôi tập trung vào', 'I focus on',
  'backend systems', 'backend systems',
  'Tôi là backend developer tập trung vào API design, system reliability và các service dễ maintain. Tôi thích các bài toán về data flow, performance, tích hợp hệ thống và những workflow có nhiều logic nghiệp vụ.', 'I am a backend developer focused on API design, system reliability, and maintainable services. I enjoy problems around data flow, performance, system integrations, and workflow-heavy business logic.',
  'Role tôi đang nhắm tới', 'Roles I am targeting',
  'Backend Developer / Backend Engineer ở các team cần service rõ ràng, ổn định và có khả năng mở rộng. Tôi cũng có hứng thú với AI automation và AI-powered workflows.', 'Backend Developer / Backend Engineer roles where I can help build clear, reliable, and scalable services. I also have a growing interest in AI automation and AI-powered workflows.'
)
on conflict (id) do nothing;
