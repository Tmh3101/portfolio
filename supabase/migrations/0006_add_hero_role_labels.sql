-- 0006_add_hero_role_labels.sql
-- Add label columns for the 3 hero roles

ALTER TABLE public.hero_section 
ADD COLUMN IF NOT EXISTS role1_label_vi text,
ADD COLUMN IF NOT EXISTS role1_label_en text,
ADD COLUMN IF NOT EXISTS role2_label_vi text,
ADD COLUMN IF NOT EXISTS role2_label_en text,
ADD COLUMN IF NOT EXISTS role3_label_vi text,
ADD COLUMN IF NOT EXISTS role3_label_en text;
