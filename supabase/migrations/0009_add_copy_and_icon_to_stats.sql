-- 0009_add_copy_and_icon_to_stats.sql
-- Add copy (multilingual) and icon fields to stats table

ALTER TABLE public.stats ADD COLUMN IF NOT EXISTS copy_vi text;
ALTER TABLE public.stats ADD COLUMN IF NOT EXISTS copy_en text;
ALTER TABLE public.stats ADD COLUMN IF NOT EXISTS icon text; -- Lucide icon name
