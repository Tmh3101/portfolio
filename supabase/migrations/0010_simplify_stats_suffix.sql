-- 0010_simplify_stats_suffix.sql
-- Merge suffix_vi and suffix_en into a single suffix field for stats

-- 1. Rename suffix_vi back to suffix
ALTER TABLE public.stats RENAME COLUMN suffix_vi TO suffix;

-- 2. Drop suffix_en
ALTER TABLE public.stats DROP COLUMN IF EXISTS suffix_en;
