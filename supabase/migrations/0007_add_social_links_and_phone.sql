-- 0007_add_social_links_and_phone.sql
-- Add phone to site_settings and create social_links table

-- 1. Add phone to site_settings
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS phone text;

-- 2. Create social_links table
CREATE TABLE IF NOT EXISTS public.social_links (
  id          bigserial PRIMARY KEY,
  name        text NOT NULL,
  url         text NOT NULL,
  icon        text,              -- e.g. "Github", "Linkedin", "Facebook", etc. (Lucide icon names)
  sort_order  integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS social_links_sort_order_idx
  ON public.social_links(sort_order ASC, id ASC);

CREATE TRIGGER social_links_set_updated_at
BEFORE UPDATE ON public.social_links
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- 3. RLS: enable and allow public SELECT
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read social_links"
  ON public.social_links
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- 4. Admin policies for social_links
CREATE POLICY "Admin full access on social_links"
  ON public.social_links
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 5. Ensure admin policies for other tables (in case they were missing)
-- Site settings
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access on site_settings') THEN
        CREATE POLICY "Admin full access on site_settings" ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
    END IF;
END $$;

-- Hero section
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access on hero_section') THEN
        CREATE POLICY "Admin full access on hero_section" ON public.hero_section FOR ALL TO authenticated USING (true) WITH CHECK (true);
    END IF;
END $$;

-- Stats
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access on stats') THEN
        CREATE POLICY "Admin full access on stats" ON public.stats FOR ALL TO authenticated USING (true) WITH CHECK (true);
    END IF;
END $$;

-- Skills
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access on skills') THEN
        CREATE POLICY "Admin full access on skills" ON public.skills FOR ALL TO authenticated USING (true) WITH CHECK (true);
    END IF;
END $$;

-- Approaches
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access on approaches') THEN
        CREATE POLICY "Admin full access on approaches" ON public.approaches FOR ALL TO authenticated USING (true) WITH CHECK (true);
    END IF;
END $$;

-- Experiences
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access on experiences') THEN
        CREATE POLICY "Admin full access on experiences" ON public.experiences FOR ALL TO authenticated USING (true) WITH CHECK (true);
    END IF;
END $$;

-- Projects
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access on projects') THEN
        CREATE POLICY "Admin full access on projects" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
    END IF;
END $$;
