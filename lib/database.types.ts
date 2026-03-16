export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.4';
  };
  public: {
    Tables: {
      approaches: {
        Row: {
          created_at: string;
          description_en: string | null;
          description_vi: string | null;
          icon: string | null;
          id: number;
          sort_order: number;
          subtitle_en: string | null;
          subtitle_vi: string | null;
          title_en: string | null;
          title_vi: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description_en?: string | null;
          description_vi?: string | null;
          icon?: string | null;
          id?: number;
          sort_order?: number;
          subtitle_en?: string | null;
          subtitle_vi?: string | null;
          title_en?: string | null;
          title_vi: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description_en?: string | null;
          description_vi?: string | null;
          icon?: string | null;
          id?: number;
          sort_order?: number;
          subtitle_en?: string | null;
          subtitle_vi?: string | null;
          title_en?: string | null;
          title_vi?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      contacts: {
        Row: {
          city: string | null;
          country: string | null;
          created_at: string | null;
          email: string;
          id: number;
          ip: string | null;
          message: string | null;
          name: string | null;
          region: string | null;
        };
        Insert: {
          city?: string | null;
          country?: string | null;
          created_at?: string | null;
          email: string;
          id?: number;
          ip?: string | null;
          message?: string | null;
          name?: string | null;
          region?: string | null;
        };
        Update: {
          city?: string | null;
          country?: string | null;
          created_at?: string | null;
          email?: string;
          id?: number;
          ip?: string | null;
          message?: string | null;
          name?: string | null;
          region?: string | null;
        };
        Relationships: [];
      };
      experiences: {
        Row: {
          company: string;
          created_at: string;
          description_en: string | null;
          description_vi: string | null;
          end_date: string | null;
          highlights_en: string[] | null;
          highlights_vi: string[] | null;
          id: number;
          is_current: boolean;
          location_en: string | null;
          location_vi: string | null;
          role_en: string | null;
          role_vi: string;
          sort_order: number;
          start_date: string;
          technologies: string[] | null;
          updated_at: string;
        };
        Insert: {
          company: string;
          created_at?: string;
          description_en?: string | null;
          description_vi?: string | null;
          end_date?: string | null;
          highlights_en?: string[] | null;
          highlights_vi?: string[] | null;
          id?: number;
          is_current?: boolean;
          location_en?: string | null;
          location_vi?: string | null;
          role_en?: string | null;
          role_vi: string;
          sort_order?: number;
          start_date: string;
          technologies?: string[] | null;
          updated_at?: string;
        };
        Update: {
          company?: string;
          created_at?: string;
          description_en?: string | null;
          description_vi?: string | null;
          end_date?: string | null;
          highlights_en?: string[] | null;
          highlights_vi?: string[] | null;
          id?: number;
          is_current?: boolean;
          location_en?: string | null;
          location_vi?: string | null;
          role_en?: string | null;
          role_vi?: string;
          sort_order?: number;
          start_date?: string;
          technologies?: string[] | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      hero_section: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          cta_primary_href: string | null;
          cta_primary_label_en: string | null;
          cta_primary_label_vi: string | null;
          cta_secondary_href: string | null;
          cta_secondary_label_en: string | null;
          cta_secondary_label_vi: string | null;
          greeting_en: string | null;
          greeting_vi: string | null;
          headline_en: string | null;
          headline_vi: string | null;
          id: number;
          name: string | null;
          roles_en: string[] | null;
          roles_vi: string[] | null;
          subheadline_en: string | null;
          subheadline_vi: string | null;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          cta_primary_href?: string | null;
          cta_primary_label_en?: string | null;
          cta_primary_label_vi?: string | null;
          cta_secondary_href?: string | null;
          cta_secondary_label_en?: string | null;
          cta_secondary_label_vi?: string | null;
          greeting_en?: string | null;
          greeting_vi?: string | null;
          headline_en?: string | null;
          headline_vi?: string | null;
          id: number;
          name?: string | null;
          roles_en?: string[] | null;
          roles_vi?: string[] | null;
          subheadline_en?: string | null;
          subheadline_vi?: string | null;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          cta_primary_href?: string | null;
          cta_primary_label_en?: string | null;
          cta_primary_label_vi?: string | null;
          cta_secondary_href?: string | null;
          cta_secondary_label_en?: string | null;
          cta_secondary_label_vi?: string | null;
          greeting_en?: string | null;
          greeting_vi?: string | null;
          headline_en?: string | null;
          headline_vi?: string | null;
          id?: number;
          name?: string | null;
          roles_en?: string[] | null;
          roles_vi?: string[] | null;
          subheadline_en?: string | null;
          subheadline_vi?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      page_visits: {
        Row: {
          browser: string | null;
          city: string | null;
          country: string | null;
          device_model: string | null;
          device_type: string | null;
          device_vendor: string | null;
          id: number;
          ip: string | null;
          os: string | null;
          path: string | null;
          region: string | null;
          user_agent: string | null;
          visited_at: string | null;
        };
        Insert: {
          browser?: string | null;
          city?: string | null;
          country?: string | null;
          device_model?: string | null;
          device_type?: string | null;
          device_vendor?: string | null;
          id?: number;
          ip?: string | null;
          os?: string | null;
          path?: string | null;
          region?: string | null;
          user_agent?: string | null;
          visited_at?: string | null;
        };
        Update: {
          browser?: string | null;
          city?: string | null;
          country?: string | null;
          device_model?: string | null;
          device_type?: string | null;
          device_vendor?: string | null;
          id?: number;
          ip?: string | null;
          os?: string | null;
          path?: string | null;
          region?: string | null;
          user_agent?: string | null;
          visited_at?: string | null;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          created_at: string;
          description_en: string | null;
          description_vi: string | null;
          featured: boolean;
          features_en: string[] | null;
          features_vi: string[] | null;
          id: number;
          images_url: string[] | null;
          live_url: string | null;
          repo_url: string | null;
          short_description_en: string | null;
          short_description_vi: string | null;
          slug: string;
          sort_order: number;
          technologies: string[] | null;
          thumbnail_url: string | null;
          title_en: string | null;
          title_vi: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description_en?: string | null;
          description_vi?: string | null;
          featured?: boolean;
          features_en?: string[] | null;
          features_vi?: string[] | null;
          id?: number;
          images_url?: string[] | null;
          live_url?: string | null;
          repo_url?: string | null;
          short_description_en?: string | null;
          short_description_vi?: string | null;
          slug: string;
          sort_order?: number;
          technologies?: string[] | null;
          thumbnail_url?: string | null;
          title_en?: string | null;
          title_vi: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description_en?: string | null;
          description_vi?: string | null;
          featured?: boolean;
          features_en?: string[] | null;
          features_vi?: string[] | null;
          id?: number;
          images_url?: string[] | null;
          live_url?: string | null;
          repo_url?: string | null;
          short_description_en?: string | null;
          short_description_vi?: string | null;
          slug?: string;
          sort_order?: number;
          technologies?: string[] | null;
          thumbnail_url?: string | null;
          title_en?: string | null;
          title_vi?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          created_at: string;
          email: string | null;
          github_url: string | null;
          id: number;
          linkedin_url: string | null;
          og_image_url: string | null;
          resume_url: string | null;
          seo_keywords_en: string[] | null;
          seo_keywords_vi: string[] | null;
          site_description_en: string | null;
          site_description_vi: string | null;
          site_title_en: string | null;
          site_title_vi: string | null;
          twitter_handle: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          github_url?: string | null;
          id: number;
          linkedin_url?: string | null;
          og_image_url?: string | null;
          resume_url?: string | null;
          seo_keywords_en?: string[] | null;
          seo_keywords_vi?: string[] | null;
          site_description_en?: string | null;
          site_description_vi?: string | null;
          site_title_en?: string | null;
          site_title_vi?: string | null;
          twitter_handle?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          github_url?: string | null;
          id?: number;
          linkedin_url?: string | null;
          og_image_url?: string | null;
          resume_url?: string | null;
          seo_keywords_en?: string[] | null;
          seo_keywords_vi?: string[] | null;
          site_description_en?: string | null;
          site_description_vi?: string | null;
          site_title_en?: string | null;
          site_title_vi?: string | null;
          twitter_handle?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      skills: {
        Row: {
          category_en: string | null;
          category_vi: string | null;
          color: string | null;
          created_at: string;
          icon_url: string | null;
          id: number;
          level_en: string | null;
          level_vi: string | null;
          name: string;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          category_en?: string | null;
          category_vi?: string | null;
          color?: string | null;
          created_at?: string;
          icon_url?: string | null;
          id?: number;
          level_en?: string | null;
          level_vi?: string | null;
          name: string;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          category_en?: string | null;
          category_vi?: string | null;
          color?: string | null;
          created_at?: string;
          icon_url?: string | null;
          id?: number;
          level_en?: string | null;
          level_vi?: string | null;
          name?: string;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      stats: {
        Row: {
          created_at: string;
          id: number;
          label_en: string | null;
          label_vi: string;
          sort_order: number;
          suffix_en: string | null;
          suffix_vi: string | null;
          updated_at: string;
          value: number;
        };
        Insert: {
          created_at?: string;
          id?: number;
          label_en?: string | null;
          label_vi: string;
          sort_order?: number;
          suffix_en?: string | null;
          suffix_vi?: string | null;
          updated_at?: string;
          value: number;
        };
        Update: {
          created_at?: string;
          id?: number;
          label_en?: string | null;
          label_vi?: string;
          sort_order?: number;
          suffix_en?: string | null;
          suffix_vi?: string | null;
          updated_at?: string;
          value?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
