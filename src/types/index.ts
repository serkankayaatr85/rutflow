import type { Database, UserRole } from "./database.types";

export type { UserRole };

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Pharmacist = Database["public"]["Tables"]["pharmacists"]["Row"];
export type Representative = Database["public"]["Tables"]["representatives"]["Row"];
export type Company = Database["public"]["Tables"]["companies"]["Row"];
export type CompanyBranch = Database["public"]["Tables"]["company_branches"]["Row"];
export type CompanyAnalytics = Database["public"]["Tables"]["company_analytics"]["Row"];

export type ProductCategory = Database["public"]["Tables"]["product_categories"]["Row"];
export type ProductBrand = Database["public"]["Tables"]["product_brands"]["Row"];
export type Product = Database["public"]["Tables"]["products"]["Row"];

export type Campaign = Database["public"]["Tables"]["campaigns"]["Row"];
export type CampaignView = Database["public"]["Tables"]["campaign_views"]["Row"];
export type CampaignClick = Database["public"]["Tables"]["campaign_clicks"]["Row"];
export type CampaignSave = Database["public"]["Tables"]["campaign_saves"]["Row"];

export type ProductSample = Database["public"]["Tables"]["product_samples"]["Row"];
export type SampleRequest = Database["public"]["Tables"]["sample_requests"]["Row"];

export type Region = Database["public"]["Tables"]["regions"]["Row"];
export type RepresentativeRegion = Database["public"]["Tables"]["representative_regions"]["Row"];
export type RepresentativeSpecialty = Database["public"]["Tables"]["representative_specialties"]["Row"];
export type RepresentativeDocument = Database["public"]["Tables"]["representative_documents"]["Row"];

export type MeetingRequest = Database["public"]["Tables"]["meeting_requests"]["Row"];
export type Follow = Database["public"]["Tables"]["follows"]["Row"];
export type PharmacistFavorite = Database["public"]["Tables"]["pharmacist_favorites"]["Row"];
export type PharmacyInterest = Database["public"]["Tables"]["pharmacy_interests"]["Row"];

/** Oturum açmış kullanıcının profili + role özel detay kaydı */
export interface CurrentUser {
  profile: Profile;
  pharmacist: Pharmacist | null;
  representative: Representative | null;
  company: Company | null;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  pharmacist: "Eczacı",
  representative: "Tıbbi Mümessil",
  company: "Firma",
  admin: "Yönetici",
};
