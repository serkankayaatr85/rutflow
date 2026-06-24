// Bu dosya Supabase tablolarının TypeScript karşılığıdır.
// Gerçek projede `supabase gen types typescript` komutuyla otomatik üretilebilir.
//
// Notion şemasından gelen tüm tabloları kapsar:
// profiles, pharmacists, representatives, companies, company_branches,
// company_analytics, product_categories, product_brands, products,
// campaigns, campaign_views, campaign_clicks, campaign_saves,
// product_samples, sample_requests, representative_specialties,
// representative_regions, representative_documents, regions,
// meeting_requests, follows, pharmacist_favorites, pharmacy_interests
//
// NOT: product_samples ve sample_requests, önceki versiyonda yanlış
// varsayılan kolonlarla yazılmıştı (samples.stock_quantity,
// sample_requests.sample_id). Bu dosya, yüklenen gerçek şemaya göre
// düzeltilmiştir.

export type UserRole = "pharmacist" | "representative" | "company" | "admin";

export type MeetingRequestType = "phone" | "visit" | "message";
export type RequestStatus = "pending" | "accepted" | "rejected" | "completed";

export interface Database {
  public: {
    Tables: {
      // ===================================================================
      // Kimlik / Roller
      // ===================================================================
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          full_name: string;
          email: string;
          phone_number: string | null;
          avatar_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role: UserRole;
          full_name: string;
          email: string;
          phone_number?: string | null;
          avatar_url?: string | null;
          is_active?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };

      pharmacists: {
        Row: {
          id: string;
          profile_id: string;
          pharmacy_name: string;
          gln_code: string;
          license_number: string;
          city: string;
          district: string | null;
          address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          pharmacy_name: string;
          gln_code: string;
          license_number: string;
          city: string;
          district?: string | null;
          address?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["pharmacists"]["Insert"]>;
      };

      representatives: {
        Row: {
          id: string;
          profile_id: string;
          company_name: string;
          /** Birincil/görünen bölge. Çoklu bölge ataması için representative_regions kullanılır. */
          region: string;
          title: string | null;
          followers_count: number;
          average_rating: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          company_name: string;
          region: string;
          title?: string | null;
          followers_count?: number;
          average_rating?: number | null;
        };
        Update: Partial<Database["public"]["Tables"]["representatives"]["Insert"]>;
      };

      companies: {
        Row: {
          id: string;
          profile_id: string;
          company_name: string;
          logo_url: string | null;
          website_url: string | null;
          contact_email: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          company_name: string;
          logo_url?: string | null;
          website_url?: string | null;
          contact_email?: string | null;
          is_active?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["companies"]["Insert"]>;
      };

      company_branches: {
        Row: {
          id: string;
          company_id: string;
          branch_name: string;
          city: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          branch_name: string;
          city: string;
        };
        Update: Partial<Database["public"]["Tables"]["company_branches"]["Insert"]>;
      };

      company_analytics: {
        Row: {
          id: string;
          company_id: string;
          /** Ay başlangıcını temsil eden tarih, örn. "2026-06-01" */
          month: string;
          total_campaign_views: number;
          total_campaign_clicks: number;
          total_interactions: number;
          total_followers: number;
        };
        Insert: {
          id?: string;
          company_id: string;
          month: string;
          total_campaign_views?: number;
          total_campaign_clicks?: number;
          total_interactions?: number;
          total_followers?: number;
        };
        Update: Partial<Database["public"]["Tables"]["company_analytics"]["Insert"]>;
      };

      // ===================================================================
      // Ürün / Kategori / Marka
      // ===================================================================
      product_categories: {
        Row: {
          id: string;
          category_name: string;
          /** Alt kategori ise üst kategoriye referans, kök kategori için null */
          parent_category_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          category_name: string;
          parent_category_id?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["product_categories"]["Insert"]>;
      };

      product_brands: {
        Row: {
          id: string;
          company_id: string;
          brand_name: string;
          logo_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          brand_name: string;
          logo_url?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["product_brands"]["Insert"]>;
      };

      products: {
        Row: {
          id: string;
          representative_id: string;
          name: string;
          category_id: string;
          description: string | null;
          image_url: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          representative_id: string;
          name: string;
          category_id: string;
          description?: string | null;
          image_url?: string | null;
          is_active?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
      };

      // ===================================================================
      // Kampanya + etkileşim olayları
      // ===================================================================
      campaigns: {
        Row: {
          id: string;
          representative_id: string;
          product_id: string;
          title: string;
          description: string | null;
          mf_condition: string;
          image_url: string | null;
          start_date: string;
          end_date: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          representative_id: string;
          product_id: string;
          title: string;
          description?: string | null;
          mf_condition: string;
          image_url?: string | null;
          start_date: string;
          end_date: string;
          is_active?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["campaigns"]["Insert"]>;
      };

      campaign_views: {
        Row: {
          id: string;
          campaign_id: string;
          pharmacist_id: string;
          viewed_at: string;
        };
        Insert: {
          id?: string;
          campaign_id: string;
          pharmacist_id: string;
          viewed_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["campaign_views"]["Insert"]>;
      };

      campaign_clicks: {
        Row: {
          id: string;
          campaign_id: string;
          pharmacist_id: string;
          clicked_at: string;
        };
        Insert: {
          id?: string;
          campaign_id: string;
          pharmacist_id: string;
          clicked_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["campaign_clicks"]["Insert"]>;
      };

      campaign_saves: {
        Row: {
          id: string;
          campaign_id: string;
          pharmacist_id: string;
          saved_at: string;
        };
        Insert: {
          id?: string;
          campaign_id: string;
          pharmacist_id: string;
          saved_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["campaign_saves"]["Insert"]>;
      };

      // ===================================================================
      // Numune (product_samples = mümessilin numune envanteri,
      // sample_requests = eczacının numune talebi)
      // ===================================================================
      product_samples: {
        Row: {
          id: string;
          product_id: string;
          representative_id: string;
          sample_available: boolean;
          sample_notes: string | null;
        };
        Insert: {
          id?: string;
          product_id: string;
          representative_id: string;
          sample_available?: boolean;
          sample_notes?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["product_samples"]["Insert"]>;
      };

      sample_requests: {
        Row: {
          id: string;
          pharmacist_id: string;
          representative_id: string;
          product_id: string;
          status: RequestStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          pharmacist_id: string;
          representative_id: string;
          product_id: string;
          status?: RequestStatus;
        };
        Update: Partial<Database["public"]["Tables"]["sample_requests"]["Insert"]>;
      };

      // ===================================================================
      // Mümessil — bölge / uzmanlık / belge (çoklu ilişkiler)
      // ===================================================================
      regions: {
        Row: {
          id: string;
          region_name: string;
        };
        Insert: {
          id?: string;
          region_name: string;
        };
        Update: Partial<Database["public"]["Tables"]["regions"]["Insert"]>;
      };

      representative_regions: {
        Row: {
          id: string;
          representative_id: string;
          region_id: string;
        };
        Insert: {
          id?: string;
          representative_id: string;
          region_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["representative_regions"]["Insert"]>;
      };

      representative_specialties: {
        Row: {
          id: string;
          representative_id: string;
          category_id: string;
        };
        Insert: {
          id?: string;
          representative_id: string;
          category_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["representative_specialties"]["Insert"]>;
      };

      representative_documents: {
        Row: {
          id: string;
          representative_id: string;
          file_name: string;
          file_url: string;
          file_type: string;
          uploaded_at: string;
        };
        Insert: {
          id?: string;
          representative_id: string;
          file_name: string;
          file_url: string;
          file_type: string;
          uploaded_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["representative_documents"]["Insert"]>;
      };

      // ===================================================================
      // Görüşme / Takip / Favori / İlgi alanı
      // ===================================================================
      meeting_requests: {
        Row: {
          id: string;
          pharmacist_id: string;
          representative_id: string;
          type: MeetingRequestType;
          status: RequestStatus;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          pharmacist_id: string;
          representative_id: string;
          type: MeetingRequestType;
          status?: RequestStatus;
          note?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["meeting_requests"]["Insert"]>;
      };

      follows: {
        Row: {
          id: string;
          pharmacist_id: string;
          representative_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          pharmacist_id: string;
          representative_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["follows"]["Insert"]>;
      };

      /**
       * pharmacist_favorites: follows ile aynı şekle sahip ayrı bir tablo.
       * Notion şemasında ikisi de var; muhtemel ayrım: follows = bildirim
       * tetikleyen takip, favorites = sessiz/işaretli liste. Hangi ekranda
       * hangisinin kullanılacağı netleşene kadar ikisi de korunuyor.
       */
      pharmacist_favorites: {
        Row: {
          id: string;
          pharmacist_id: string;
          representative_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          pharmacist_id: string;
          representative_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["pharmacist_favorites"]["Insert"]>;
      };

      pharmacy_interests: {
        Row: {
          id: string;
          pharmacist_id: string;
          category_id: string;
        };
        Insert: {
          id?: string;
          pharmacist_id: string;
          category_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["pharmacy_interests"]["Insert"]>;
      };
    };
  };
}
