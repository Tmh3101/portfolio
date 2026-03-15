import { getSupabaseServerClient } from '../supabase/server';

/**
 * Service to fetch public data from Supabase for the portfolio frontend.
 * Optimized for React Server Components.
 */
export const publicService = {
  /**
   * Fetch all portfolio data in parallel.
   */
  async getPortfolioData() {
    const supabase = getSupabaseServerClient();

    const [
      { data: settings },
      { data: hero },
      { data: stats },
      { data: skills },
      { data: approaches },
      { data: experiences },
      { data: projects },
    ] = await Promise.all([
      supabase.from('site_settings').select('*').eq('id', 1).single(),
      supabase.from('hero_section').select('*').eq('id', 1).single(),
      supabase.from('stats').select('*').order('sort_order', { ascending: true }),
      supabase
        .from('skills')
        .select('*')
        .order('category', { ascending: true })
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

    return {
      settings: settings || {},
      hero: hero || {},
      stats: stats || [],
      skills: skills || [],
      approaches: approaches || [],
      experiences: experiences || [],
      projects: projects || [],
    };
  },
};
