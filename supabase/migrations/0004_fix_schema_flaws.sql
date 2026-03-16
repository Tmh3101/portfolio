-- 0004_fix_schema_flaws.sql
-- Fix data loss and over-localization issues in the Supabase database schema

-- 1. Fix site_settings table
-- Add the missing resume link
ALTER TABLE public.site_settings ADD COLUMN resume_url text;

-- 2. Fix projects table
-- Add a text array for a gallery of images
ALTER TABLE public.projects ADD COLUMN images_url text[];
-- Add text arrays for project features (localized)
ALTER TABLE public.projects ADD COLUMN features_vi text[];
ALTER TABLE public.projects ADD COLUMN features_en text[];
-- Rename tags back to technologies to match the frontend expectations
ALTER TABLE public.projects RENAME COLUMN tags TO technologies;

-- 3. Fix skills table (Fix Over-localization)
-- The name of a technology (e.g., "React") does not need translation.
-- Rename name_vi to just name
ALTER TABLE public.skills RENAME COLUMN name_vi TO name;
-- Drop the redundant English name
ALTER TABLE public.skills DROP COLUMN name_en;
-- Add the missing color field for UI styling
ALTER TABLE public.skills ADD COLUMN color text;
