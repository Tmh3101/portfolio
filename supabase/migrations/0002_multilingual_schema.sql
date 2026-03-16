-- 0002_multilingual_schema.sql
-- Update schema for multilingual support (Vietnamese/English)

-- 1. SITE SETTINGS
ALTER TABLE public.site_settings RENAME COLUMN site_title TO site_title_vi;
ALTER TABLE public.site_settings ADD COLUMN site_title_en text;
ALTER TABLE public.site_settings RENAME COLUMN site_description TO site_description_vi;
ALTER TABLE public.site_settings ADD COLUMN site_description_en text;
ALTER TABLE public.site_settings RENAME COLUMN seo_keywords TO seo_keywords_vi;
ALTER TABLE public.site_settings ADD COLUMN seo_keywords_en text[];

-- 2. HERO SECTION
ALTER TABLE public.hero_section RENAME COLUMN greeting TO greeting_vi;
ALTER TABLE public.hero_section ADD COLUMN greeting_en text;
ALTER TABLE public.hero_section RENAME COLUMN headline TO headline_vi;
ALTER TABLE public.hero_section ADD COLUMN headline_en text;
ALTER TABLE public.hero_section RENAME COLUMN subheadline TO subheadline_vi;
ALTER TABLE public.hero_section ADD COLUMN subheadline_en text;
ALTER TABLE public.hero_section RENAME COLUMN roles TO roles_vi;
ALTER TABLE public.hero_section ADD COLUMN roles_en text[];
ALTER TABLE public.hero_section RENAME COLUMN cta_primary_label TO cta_primary_label_vi;
ALTER TABLE public.hero_section ADD COLUMN cta_primary_label_en text;
ALTER TABLE public.hero_section RENAME COLUMN cta_secondary_label TO cta_secondary_label_vi;
ALTER TABLE public.hero_section ADD COLUMN cta_secondary_label_en text;

-- 3. STATS
ALTER TABLE public.stats RENAME COLUMN label TO label_vi;
ALTER TABLE public.stats ADD COLUMN label_en text;
ALTER TABLE public.stats RENAME COLUMN suffix TO suffix_vi;
ALTER TABLE public.stats ADD COLUMN suffix_en text;

-- 4. SKILLS
ALTER TABLE public.skills RENAME COLUMN name TO name_vi;
ALTER TABLE public.skills ADD COLUMN name_en text;
ALTER TABLE public.skills RENAME COLUMN category TO category_vi;
ALTER TABLE public.skills ADD COLUMN category_en text;
ALTER TABLE public.skills RENAME COLUMN level TO level_vi;
ALTER TABLE public.skills ADD COLUMN level_en text;

-- 5. APPROACHES
ALTER TABLE public.approaches RENAME COLUMN title TO title_vi;
ALTER TABLE public.approaches ADD COLUMN title_en text;
ALTER TABLE public.approaches RENAME COLUMN subtitle TO subtitle_vi;
ALTER TABLE public.approaches ADD COLUMN subtitle_en text;
ALTER TABLE public.approaches RENAME COLUMN description TO description_vi;
ALTER TABLE public.approaches ADD COLUMN description_en text;

-- 6. EXPERIENCES
ALTER TABLE public.experiences RENAME COLUMN role TO role_vi;
ALTER TABLE public.experiences ADD COLUMN role_en text;
ALTER TABLE public.experiences RENAME COLUMN location TO location_vi;
ALTER TABLE public.experiences ADD COLUMN location_en text;
ALTER TABLE public.experiences RENAME COLUMN description TO description_vi;
ALTER TABLE public.experiences ADD COLUMN description_en text;
ALTER TABLE public.experiences RENAME COLUMN highlights TO highlights_vi;
ALTER TABLE public.experiences ADD COLUMN highlights_en text[];

-- 7. PROJECTS
ALTER TABLE public.projects RENAME COLUMN title TO title_vi;
ALTER TABLE public.projects ADD COLUMN title_en text;
ALTER TABLE public.projects RENAME COLUMN short_description TO short_description_vi;
ALTER TABLE public.projects ADD COLUMN short_description_en text;
ALTER TABLE public.projects RENAME COLUMN description TO description_vi;
ALTER TABLE public.projects ADD COLUMN description_en text;
