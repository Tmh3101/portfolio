import { cache } from 'react';
import { createClient } from '../supabase/server';

/**
 * Service to fetch public data from Supabase for the portfolio frontend.
 * Optimized for React Server Components using React.cache to avoid duplicate queries.
 */
export const publicService = {
  /**
   * Fetch all portfolio data in parallel.
   * Wrapped in React.cache to deduplicate requests within a single render pass.
   */
  getPortfolioData: cache(async () => {
    // Use the async Supabase server client
    const supabase = await createClient();

    try {
      const [
        { data: settings, error: settingsError },
        { data: hero, error: heroError },
        { data: stats, error: statsError },
        { data: skills, error: skillsError },
        { data: skillSection, error: skillSectionError },
        { data: skillCategories, error: skillCategoriesError },
        { data: approaches, error: approachesError },
        { data: approachSection, error: approachSectionError },
        { data: experiences, error: experiencesError },
        { data: experienceSection, error: experienceSectionError },
        { data: projects, error: projectsError },
        { data: socialLinks, error: socialLinksError },
        { data: techMarquee, error: techMarqueeError },
      ] = await Promise.all([
        supabase.from('site_settings').select('*').eq('id', 1).single(),
        supabase.from('hero_section').select('*').eq('id', 1).single(),
        supabase.from('stats').select('*').order('sort_order', { ascending: true }),
        supabase.from('skills').select('*').order('sort_order', { ascending: true }),
        supabase.from('skill_section').select('*').eq('id', 1).single(),
        supabase.from('skill_categories').select('*').order('sort_order', { ascending: true }),
        supabase.from('approaches').select('*').order('sort_order', { ascending: true }),
        supabase.from('approach_section').select('*').eq('id', 1).single(),
        supabase
          .from('experiences')
          .select('*')
          .order('sort_order', { ascending: true })
          .order('start_date', { ascending: false }),
        supabase.from('experience_section').select('*').eq('id', 1).single(),
        supabase
          .from('projects')
          .select('*')
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: false }),
        supabase.from('social_links').select('*').order('sort_order', { ascending: true }),
        supabase.from('tech_marquee').select('*').order('sort_order', { ascending: true }),
      ]);

      // Log errors but don't crash the whole page
      if (settingsError) console.error('Error fetching settings:', settingsError);
      if (heroError) console.error('Error fetching hero:', heroError);
      if (statsError) console.error('Error fetching stats:', statsError);
      if (skillsError) console.error('Error fetching skills:', skillsError);
      if (skillSectionError) console.error('Error fetching skill section:', skillSectionError);
      if (skillCategoriesError)
        console.error('Error fetching skill categories:', skillCategoriesError);
      if (approachesError) console.error('Error fetching approaches:', approachesError);
      if (approachSectionError)
        console.error('Error fetching approach section:', approachSectionError);
      if (experiencesError) console.error('Error fetching experiences:', experiencesError);
      if (experienceSectionError)
        console.error('Error fetching experience section:', experienceSectionError);
      if (projectsError) console.error('Error fetching projects:', projectsError);
      if (socialLinksError) console.error('Error fetching social links:', socialLinksError);
      if (techMarqueeError) console.error('Error fetching tech marquee:', techMarqueeError);

      return {
        settings: settings || {},
        hero: hero || {},
        stats: stats || [],
        skills: skills || [],
        skillSection: skillSection || {},
        skillCategories: skillCategories || [],
        approaches: approaches || [],
        approachSection: approachSection || {},
        experiences: experiences || [],
        experienceSection: experienceSection || {},
        projects: projects || [],
        socialLinks: socialLinks || [],
        techMarquee: techMarquee || [],
      };
    } catch (error) {
      console.error('Unhandled error in getPortfolioData:', error);
      return {
        settings: {},
        hero: {},
        stats: [],
        skills: [],
        skillSection: {},
        skillCategories: [],
        approaches: [],
        approachSection: {},
        experiences: [],
        experienceSection: {},
        projects: [],
        socialLinks: [],
        techMarquee: [],
      };
    }
  }),
};
