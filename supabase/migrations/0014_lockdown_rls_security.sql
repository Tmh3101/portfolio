-- 0014_lockdown_rls_security.sql
-- Comprehensive Row Level Security (RLS) Lockdown for Supabase Database
-- Fixes critical vulnerability: prevents anon from reading/writing contacts, and locks down write access on public content tables.

-- ==============================================================================
-- 1. ENABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES
-- ==============================================================================
ALTER TABLE IF EXISTS public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.hero_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.experience_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.skill_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.approach_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.approaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.tech_marquee ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.contacts ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'visits') THEN
    ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- ==============================================================================
-- 2. DROP OVERLY PERMISSIVE OR CONFLICTING EXISTING POLICIES
-- ==============================================================================
-- Contacts: drop any existing public policies
DROP POLICY IF EXISTS "Public read contacts" ON public.contacts;
DROP POLICY IF EXISTS "Public insert contacts" ON public.contacts;
DROP POLICY IF EXISTS "Public update contacts" ON public.contacts;
DROP POLICY IF EXISTS "Public delete contacts" ON public.contacts;
DROP POLICY IF EXISTS "Enable all access for all users" ON public.contacts;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.contacts;

-- Public content tables: ensure no rogue write policies exist for anon
DROP POLICY IF EXISTS "Public write site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Public write hero_section" ON public.hero_section;
DROP POLICY IF EXISTS "Public write experience_section" ON public.experience_section;
DROP POLICY IF EXISTS "Public write skill_section" ON public.skill_section;
DROP POLICY IF EXISTS "Public write approach_section" ON public.approach_section;
DROP POLICY IF EXISTS "Public write approaches" ON public.approaches;
DROP POLICY IF EXISTS "Public write stats" ON public.stats;
DROP POLICY IF EXISTS "Public write projects" ON public.projects;
DROP POLICY IF EXISTS "Public write skills" ON public.skills;
DROP POLICY IF EXISTS "Public write skill_categories" ON public.skill_categories;
DROP POLICY IF EXISTS "Public write experiences" ON public.experiences;
DROP POLICY IF EXISTS "Public write social_links" ON public.social_links;
DROP POLICY IF EXISTS "Public write tech_marquee" ON public.tech_marquee;

-- ==============================================================================
-- 3. CONTACTS TABLE: STRICT LOCKDOWN (ZERO ANON ACCESS)
-- Note: /api/contact uses service_role_key on the server which bypasses RLS.
-- Admin portal authenticated users can view, update, and delete.
-- ==============================================================================
CREATE POLICY "Admin view contacts"
  ON public.contacts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin manage contacts"
  ON public.contacts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ==============================================================================
-- 4. PUBLIC CONTENT TABLES: READ-ONLY FOR ANON, FULL ACCESS FOR AUTHENTICATED
-- ==============================================================================

-- SITE_SETTINGS
DROP POLICY IF EXISTS "Public read site_settings" ON public.site_settings;
CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Admin manage site_settings" ON public.site_settings;
CREATE POLICY "Admin manage site_settings" ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- HERO_SECTION
DROP POLICY IF EXISTS "Public read hero_section" ON public.hero_section;
CREATE POLICY "Public read hero_section" ON public.hero_section FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Admin manage hero_section" ON public.hero_section;
CREATE POLICY "Admin manage hero_section" ON public.hero_section FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- EXPERIENCE_SECTION
DROP POLICY IF EXISTS "Public read experience_section" ON public.experience_section;
CREATE POLICY "Public read experience_section" ON public.experience_section FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Admin manage experience_section" ON public.experience_section;
CREATE POLICY "Admin manage experience_section" ON public.experience_section FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- SKILL_SECTION
DROP POLICY IF EXISTS "Public read skill_section" ON public.skill_section;
CREATE POLICY "Public read skill_section" ON public.skill_section FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Admin manage skill_section" ON public.skill_section;
CREATE POLICY "Admin manage skill_section" ON public.skill_section FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- APPROACH_SECTION
DROP POLICY IF EXISTS "Public read approach_section" ON public.approach_section;
CREATE POLICY "Public read approach_section" ON public.approach_section FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Admin manage approach_section" ON public.approach_section;
CREATE POLICY "Admin manage approach_section" ON public.approach_section FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- APPROACHES
DROP POLICY IF EXISTS "Public read approaches" ON public.approaches;
CREATE POLICY "Public read approaches" ON public.approaches FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Admin manage approaches" ON public.approaches;
CREATE POLICY "Admin manage approaches" ON public.approaches FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- STATS
DROP POLICY IF EXISTS "Public read stats" ON public.stats;
CREATE POLICY "Public read stats" ON public.stats FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Admin manage stats" ON public.stats;
CREATE POLICY "Admin manage stats" ON public.stats FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- PROJECTS
DROP POLICY IF EXISTS "Public read projects" ON public.projects;
CREATE POLICY "Public read projects" ON public.projects FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Admin manage projects" ON public.projects;
CREATE POLICY "Admin manage projects" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- SKILLS
DROP POLICY IF EXISTS "Public read skills" ON public.skills;
CREATE POLICY "Public read skills" ON public.skills FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Admin manage skills" ON public.skills;
CREATE POLICY "Admin manage skills" ON public.skills FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- SKILL_CATEGORIES
DROP POLICY IF EXISTS "Public read skill_categories" ON public.skill_categories;
CREATE POLICY "Public read skill_categories" ON public.skill_categories FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Admin manage skill_categories" ON public.skill_categories;
CREATE POLICY "Admin manage skill_categories" ON public.skill_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- EXPERIENCES
DROP POLICY IF EXISTS "Public read experiences" ON public.experiences;
CREATE POLICY "Public read experiences" ON public.experiences FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Admin manage experiences" ON public.experiences;
CREATE POLICY "Admin manage experiences" ON public.experiences FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- SOCIAL_LINKS
DROP POLICY IF EXISTS "Public read social_links" ON public.social_links;
CREATE POLICY "Public read social_links" ON public.social_links FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Admin manage social_links" ON public.social_links;
CREATE POLICY "Admin manage social_links" ON public.social_links FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- TECH_MARQUEE
DROP POLICY IF EXISTS "Public read tech_marquee" ON public.tech_marquee;
CREATE POLICY "Public read tech_marquee" ON public.tech_marquee FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Admin manage tech_marquee" ON public.tech_marquee;
CREATE POLICY "Admin manage tech_marquee" ON public.tech_marquee FOR ALL TO authenticated USING (true) WITH CHECK (true);
