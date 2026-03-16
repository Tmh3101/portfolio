-- 0005_add_hero_subtitle.sql
-- Add subtitle columns to the hero_section table

ALTER TABLE public.hero_section ADD COLUMN IF NOT EXISTS subtitle_vi text;
ALTER TABLE public.hero_section ADD COLUMN IF NOT EXISTS subtitle_en text;
