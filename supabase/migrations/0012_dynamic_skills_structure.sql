-- 0012_dynamic_skills_structure.sql
-- Create tables to make the Skills section fully dynamic

-- 1. Skill Section Metadata
create table if not exists public.skill_section (
  id                  smallint primary key check (id = 1),
  eyebrow_vi          text,
  eyebrow_en          text,
  title1_vi           text,
  title1_en           text,
  title2_vi           text,
  title2_en           text,
  description_vi      text,
  description_en      text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- 2. Skill Categories (The cards: Backend, Data, etc.)
create table if not exists public.skill_categories (
  id                  bigserial primary key,
  name_vi             text not null,
  name_en             text,
  description_vi      text,
  description_en      text,
  icon                text,
  sort_order          integer not null default 0,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- 3. Link individual skills to categories
-- We'll add a category_id column to the existing skills table
alter table public.skills add column if not exists category_id bigint references public.skill_categories(id) on delete set null;

-- Enable RLS
alter table public.skill_section enable row level security;
alter table public.skill_categories enable row level security;

-- Public read access
create policy "Public read skill_section" on public.skill_section for select to anon using (true);
create policy "Public read skill_categories" on public.skill_categories for select to anon using (true);

-- Admin full access for authenticated users
create policy "Admin full access on skill_section" on public.skill_section for all to authenticated using (true) with check (true);
create policy "Admin full access on skill_categories" on public.skill_categories for all to authenticated using (true) with check (true);

-- Triggers for updated_at
create trigger skill_section_set_updated_at before update on public.skill_section for each row execute function handle_updated_at();
create trigger skill_categories_set_updated_at before update on public.skill_categories for each row execute function handle_updated_at();

-- Insert default section data
insert into public.skill_section (
  id, eyebrow_vi, eyebrow_en, title1_vi, title1_en, title2_vi, title2_en, description_vi, description_en
) values (
  1, 
  'Toolkit', 'Toolkit',
  'Năng lực', 'Core',
  'cốt lõi', 'capabilities',
  'Những mảng kỹ thuật tôi dùng thường xuyên khi xây backend, xử lý dữ liệu và đưa hệ thống vào môi trường chạy thực tế.', 'The areas I rely on most when building backend services, shaping data, and shipping systems into real environments.'
) on conflict (id) do nothing;

-- Insert some default categories to match the screenshot
insert into public.skill_categories (name_vi, name_en, description_vi, description_en, icon, sort_order)
values 
('Backend', 'Backend', 'API design, service layers, auth, business logic và các tích hợp backend.', 'API design, service layers, auth, business logic, and backend integrations.', 'server', 0),
('Data', 'Data', 'Thiết kế schema, tối ưu truy vấn và giữ dữ liệu nhất quán cho sản phẩm.', 'Schema design, query optimization, and data consistency for product workloads.', 'database', 1),
('Delivery', 'Delivery', 'Containerization, môi trường triển khai và quy trình release ổn định.', 'Containerization, deployment environments, and reliable release workflows.', 'package', 2),
('Support', 'Support', 'Đủ để phối hợp với frontend, debug flow end-to-end và hỗ trợ khi cần chạm vào bề mặt sản phẩm.', 'Enough to collaborate with frontend, debug end-to-end flows, and support product delivery when needed.', 'layout', 3)
on conflict do nothing;
