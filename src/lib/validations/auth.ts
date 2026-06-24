import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "E-posta zorunludur").email("Geçerli bir e-posta girin"),
  password: z.string().min(1, "Şifre zorunludur"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const userTypeSchema = z.enum(["pharmacist", "representative", "company"]);
export type RegisterUserType = z.infer<typeof userTypeSchema>;

const baseRegisterFields = {
  fullName: z.string().min(2, "Ad soyad en az 2 karakter olmalı"),
  email: z.string().min(1, "E-posta zorunludur").email("Geçerli bir e-posta girin"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
  confirmPassword: z.string().min(6, "Şifre tekrarı zorunludur"),
};

const pharmacistFields = z.object({
  userType: z.literal("pharmacist"),
  ...baseRegisterFields,
  pharmacyName: z.string().min(2, "Eczane adı zorunludur"),
  glnCode: z.string().min(1, "GLN kodu zorunludur"),
  licenseNumber: z.string().min(1, "Sicil numarası zorunludur"),
  city: z.string().min(1, "İl zorunludur"),
  district: z.string().optional(),
});

const representativeFields = z.object({
  userType: z.literal("representative"),
  ...baseRegisterFields,
  companyName: z.string().min(2, "Firma adı zorunludur"),
  region: z.string().min(1, "Bölge zorunludur"),
});

const companyFields = z.object({
  userType: z.literal("company"),
  ...baseRegisterFields,
  companyName: z.string().min(2, "Firma adı zorunludur"),
  contactEmail: z.string().email("Geçerli bir kurumsal e-posta girin").optional().or(z.literal("")),
  websiteUrl: z.string().url("Geçerli bir web adresi girin").optional().or(z.literal("")),
});

/**
 * userType alanına göre dallanan tek bir kayıt şeması.
 * Şifre eşleşme kontrolü, discriminatedUnion sonrası tek bir
 * .refine() ile tüm dallar için ortak şekilde uygulanır.
 */
export const registerSchema = z
  .discriminatedUnion("userType", [pharmacistFields, representativeFields, companyFields])
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
export type PharmacistRegisterInput = Extract<RegisterInput, { userType: "pharmacist" }>;
export type RepresentativeRegisterInput = Extract<RegisterInput, { userType: "representative" }>;
export type CompanyRegisterInput = Extract<RegisterInput, { userType: "company" }>;
