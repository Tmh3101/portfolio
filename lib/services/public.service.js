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
        { data: approaches, error: approachesError },
        { data: experiences, error: experiencesError },
        { data: projects, error: projectsError },
      ] = await Promise.all([
        supabase.from('site_settings').select('*').eq('id', 1).single(),
        supabase.from('hero_section').select('*').eq('id', 1).single(),
        supabase.from('stats').select('*').order('sort_order', { ascending: true }),
        supabase
          .from('skills')
          .select('*')
          .order('category_vi', { ascending: true })
          .order('sort_order', { ascending: true }),
        supabase.from('approaches').select('*').order('sort_order', { ascending: true }),
        supabase
          .from('experiences')
          .select('*')
          .order('sort_order', { ascending: true })
          .order('start_date', { ascending: false }),
        supabase
          .from('projects')
          .select('*')
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: false }),
      ]);

      // Log errors but don't crash the whole page
      if (settingsError) console.error('Error fetching settings:', settingsError);
      if (heroError) console.error('Error fetching hero:', heroError);
      if (statsError) console.error('Error fetching stats:', statsError);
      if (skillsError) console.error('Error fetching skills:', skillsError);
      if (approachesError) console.error('Error fetching approaches:', approachesError);
      if (experiencesError) console.error('Error fetching experiences:', experiencesError);
      if (projectsError) console.error('Error fetching projects:', projectsError);

      return {
        settings: settings || {},
        hero: hero || {},
        stats: stats || [],
        skills: skills || [],
        approaches: approaches || [],
        experiences: experiences || [],
        projects: projects || [],
      };
    } catch (error) {
      console.error('Unhandled error in getPortfolioData:', error);
      return {
        settings: {},
        hero: {},
        stats: [],
        skills: [],
        approaches: [],
        experiences: [],
        projects: [],
      };
    }
  }),
};
