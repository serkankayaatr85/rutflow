"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, type SubmitHandler } from "react-hook-form";
import { ArrowLeft, Loader2, MailCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserTypeSelector } from "@/components/auth/user-type-selector";
import { createClient } from "@/lib/supabase/client";
import { registerSchema, type RegisterUserType } from "@/lib/validations/auth";

/** RHF için düz (flat) form alanları — role göre koşullu render edilir */
interface RegisterFormValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  // eczacı
  pharmacyName?: string;
  glnCode?: string;
  licenseNumber?: string;
  city?: string;
  district?: string;
  // mümessil & firma ortak
  companyName?: string;
  // mümessil
  region?: string;
  // firma
  contactEmail?: string;
  websiteUrl?: string;
}

type Step = "type" | "details" | "success";

export function RegisterForm() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState<Step>("type");
  const [userType, setUserType] = useState<RegisterUserType | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>();

  function handleSelectType(type: RegisterUserType) {
    setUserType(type);
    setStep("details");
  }

  const onSubmit: SubmitHandler<RegisterFormValues> = async (values) => {
    if (!userType) return;
    setFormError(null);

    const parsed = registerSchema.safeParse({ userType, ...values });

    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[issue.path.length - 1] as keyof RegisterFormValues;
        setError(field, { message: issue.message });
      });
      return;
    }

    const data = parsed.data;

    const { error, data: signUpData } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: buildUserMetadata(data),
      },
    });

    if (error) {
      setFormError(
        error.message.includes("already registered")
          ? "Bu e-posta ile zaten bir hesap var."
          : "Kayıt oluşturulamadı. Lütfen tekrar deneyin."
      );
      return;
    }

    // E-posta doğrulaması açıksa session henüz oluşmaz -> bilgi ekranı göster.
    if (signUpData.user && !signUpData.session) {
      setStep("success");
      return;
    }

    router.replace("/dashboard");
    router.refresh();
  };

  if (step === "success") {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary">
            <MailCheck className="h-6 w-6" />
          </span>
          <h2 className="text-lg font-semibold text-foreground">E-postanı doğrula</h2>
          <p className="text-sm text-muted-foreground">
            Hesabını aktifleştirmek için sana gönderdiğimiz doğrulama
            bağlantısına tıkla. Doğruladıktan sonra giriş yapabilirsin.
          </p>
          <Button asChild className="mt-4">
            <Link href="/login">Giriş Ekranına Dön</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (step === "type") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Kayıt Ol</CardTitle>
          <CardDescription>RutFlow&apos;da nasıl yer almak istersin?</CardDescription>
        </CardHeader>
        <CardContent>
          <UserTypeSelector value={userType} onChange={handleSelectType} />
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Zaten hesabın var mı?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Giriş Yap
            </Link>
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <button
          type="button"
          onClick={() => setStep("type")}
          className="mb-2 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Kullanıcı tipini değiştir
        </button>
        <CardTitle>{userType && roleTitles[userType]}</CardTitle>
        <CardDescription>Hesabını oluşturmak için bilgilerini gir</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Ad Soyad</Label>
            <Input id="fullName" autoComplete="name" {...register("fullName")} />
            {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-posta</Label>
            <Input id="email" type="email" autoComplete="email" {...register("email")} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <Input id="password" type="password" autoComplete="new-password" {...register("password")} />
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          {userType === "pharmacist" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="pharmacyName">Eczane Adı</Label>
                <Input id="pharmacyName" {...register("pharmacyName")} />
                {errors.pharmacyName && (
                  <p className="text-sm text-destructive">{errors.pharmacyName.message}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="glnCode">GLN Kodu</Label>
                  <Input id="glnCode" {...register("glnCode")} />
                  {errors.glnCode && <p className="text-sm text-destructive">{errors.glnCode.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">Sicil No</Label>
                  <Input id="licenseNumber" {...register("licenseNumber")} />
                  {errors.licenseNumber && (
                    <p className="text-sm text-destructive">{errors.licenseNumber.message}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">İl</Label>
                  <Input id="city" placeholder="İzmir" {...register("city")} />
                  {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">İlçe</Label>
                  <Input id="district" {...register("district")} />
                </div>
              </div>
            </>
          )}

          {userType === "representative" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="companyName">Firma</Label>
                <Input id="companyName" {...register("companyName")} />
                {errors.companyName && (
                  <p className="text-sm text-destructive">{errors.companyName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">Bölge</Label>
                <Input id="region" placeholder="Ege Bölgesi" {...register("region")} />
                {errors.region && <p className="text-sm text-destructive">{errors.region.message}</p>}
              </div>
            </>
          )}

          {userType === "company" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="companyName">Firma Adı</Label>
                <Input id="companyName" {...register("companyName")} />
                {errors.companyName && (
                  <p className="text-sm text-destructive">{errors.companyName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Kurumsal İletişim E-postası</Label>
                <Input id="contactEmail" type="email" {...register("contactEmail")} />
                {errors.contactEmail && (
                  <p className="text-sm text-destructive">{errors.contactEmail.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="websiteUrl">Web Sitesi</Label>
                <Input id="websiteUrl" placeholder="https://" {...register("websiteUrl")} />
                {errors.websiteUrl && (
                  <p className="text-sm text-destructive">{errors.websiteUrl.message}</p>
                )}
              </div>
            </>
          )}

          {formError && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{formError}</p>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Hesabı Oluştur
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

const roleTitles: Record<RegisterUserType, string> = {
  pharmacist: "Eczacı Kaydı",
  representative: "Tıbbi Mümessil Kaydı",
  company: "Firma Kaydı",
};

/**
 * signUp() options.data içine giden metadata.
 * Bu alanlar 001_profile_trigger.sql'deki handle_new_user() fonksiyonu
 * tarafından okunup profiles + role tablosuna yazılır.
 */
function buildUserMetadata(data: ReturnType<typeof registerSchema.parse>) {
  const common = { role: data.userType, full_name: data.fullName };

  if (data.userType === "pharmacist") {
    return {
      ...common,
      pharmacy_name: data.pharmacyName,
      gln_code: data.glnCode,
      license_number: data.licenseNumber,
      city: data.city,
      district: data.district ?? null,
    };
  }

  if (data.userType === "representative") {
    return {
      ...common,
      company_name: data.companyName,
      region: data.region,
    };
  }

  return {
    ...common,
    company_name: data.companyName,
    contact_email: data.contactEmail || null,
    website_url: data.websiteUrl || null,
  };
}
