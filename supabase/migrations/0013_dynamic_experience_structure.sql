-- 0013_dynamic_experience_structure.sql
-- Create tables to make the Experience section fully dynamic

-- 1. Experience Section Metadata
create table if not exists public.experience_section (
  id                  smallint primary key check (id = 1),
  eyebrow_vi          text,
  eyebrow_en          text,
  title1_vi           text,
  title1_en           text,
  title2_vi           text,
  title2_en           text,
  description_vi      text,
  description_en      text,
  current_role_label_vi text,
  current_role_label_en text,
  earlier_roles_label_vi text,
  earlier_roles_label_en text,
  earlier_roles_copy_vi text,
  earlier_roles_copy_en text,
  education_label_vi  text,
  education_label_en  text,
  highlights_label_vi text,
  highlights_label_en text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- 2. Add type to experiences table to distinguish between Work and Education
-- Also add a column to specifically mark the current featured role if needed, 
-- but we can continue to use is_current.
do $$ 
begin
  if not exists (select 1 from information_schema.columns where table_name='experiences' and column_name='type') then
    alter table public.experiences add column type text default 'work' check (type in ('work', 'education'));
  end if;
end $$;

-- Enable RLS
alter table public.experience_section enable row level security;

-- Public read access
create policy "Public read experience_section" on public.experience_section for select to anon using (true);

-- Admin full access for authenticated users
create policy "Admin full access on experience_section" on public.experience_section for all to authenticated using (true) with check (true);

-- Trigger for updated_at
create trigger experience_section_set_updated_at before update on public.experience_section for each row execute function handle_updated_at();

-- Insert default section data
insert into public.experience_section (
  id, 
  eyebrow_vi, eyebrow_en, 
  title1_vi, title1_en, 
  title2_vi, title2_en, 
  description_vi, description_en,
  current_role_label_vi, current_role_label_en,
  earlier_roles_label_vi, earlier_roles_label_en,
  earlier_roles_copy_vi, earlier_roles_copy_en,
  education_label_vi, education_label_en,
  highlights_label_vi, highlights_label_en
) values (
  1, 
  'Hành trình', 'Journey',
  'Kinh nghiệm', 'Professional',
  'làm việc', 'Experience',
  'Hành trình từ khi còn là sinh viên đến khi trở thành Backend Developer, tập trung vào việc xây dựng các hệ thống ổn định và có khả năng mở rộng.', 'A journey from student years to Backend Developer, focusing on building stable and scalable systems.',
  'Vai trò hiện tại', 'Current role',
  'Các chặng trước', 'Earlier roles',
  'Những vai trò trước đó tạo nền cho cách tôi xây backend systems hôm nay.', 'The earlier roles that shaped how I approach backend systems today.',
  'Học vấn', 'Education',
  'Điểm chính', 'Highlights'
) on conflict (id) do nothing;
