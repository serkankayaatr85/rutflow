import { Building2, FlaskConical, Megaphone, Package, Stethoscope, Users } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser } from "@/lib/supabase/queries";
import { ROLE_LABELS } from "@/types";

export default async function DashboardPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) return null;

  const { profile, pharmacist, representative, company } = currentUser;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Tekrar hoş geldin, {profile.full_name.split(" ")[0]}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {ROLE_LABELS[profile.role]} hesabınla giriş yaptın.
        </p>
      </div>

      {pharmacist && <PharmacistSummary pharmacist={pharmacist} />}
      {representative && <RepresentativeSummary representative={representative} />}
      {company && <CompanySummary company={company} />}

      <NextStepsCard role={profile.role} />
    </div>
  );
}

function PharmacistSummary({ pharmacist }: { pharmacist: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>["pharmacist"] }) {
  if (!pharmacist) return null;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <SummaryCard icon={<Stethoscope className="h-4 w-4" />} label="Eczane" value={pharmacist.pharmacy_name} />
      <SummaryCard icon={<Building2 className="h-4 w-4" />} label="İl / İlçe" value={[pharmacist.city, pharmacist.district].filter(Boolean).join(" / ")} />
      <SummaryCard icon={<Package className="h-4 w-4" />} label="GLN Kodu" value={pharmacist.gln_code} />
    </div>
  );
}

function RepresentativeSummary({
  representative,
}: {
  representative: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>["representative"];
}) {
  if (!representative) return null;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <SummaryCard icon={<Building2 className="h-4 w-4" />} label="Firma" value={representative.company_name} />
      <SummaryCard icon={<Stethoscope className="h-4 w-4" />} label="Bölge" value={representative.region} />
      <SummaryCard icon={<Users className="h-4 w-4" />} label="Takipçi" value={String(representative.followers_count)} />
      <SummaryCard
        icon={<Megaphone className="h-4 w-4" />}
        label="Ortalama Puan"
        value={representative.average_rating ? representative.average_rating.toFixed(1) : "—"}
      />
    </div>
  );
}

function CompanySummary({ company }: { company: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>["company"] }) {
  if (!company) return null;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <SummaryCard icon={<Building2 className="h-4 w-4" />} label="Firma Adı" value={company.company_name} />
      <SummaryCard icon={<Users className="h-4 w-4" />} label="İletişim E-posta" value={company.contact_email ?? "—"} />
      <SummaryCard icon={<Megaphone className="h-4 w-4" />} label="Web Sitesi" value={company.website_url ?? "—"} />
    </div>
  );
}

function SummaryCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="truncate text-sm font-medium text-foreground">{value || "—"}</p>
        </div>
      </CardContent>
    </Card>
  );
}

const ROLE_NEXT_STEPS: Record<string, { title: string; description: string; icon: React.ReactNode }[]> = {
  pharmacist: [
    {
      title: "Mümessil Ara",
      description: "Ürün veya firma adıyla mümessilleri bulup takip edebileceksin.",
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: "Numune Talep Et",
      description: "Beğendiğin ürünler için doğrudan numune talebi oluşturabileceksin.",
      icon: <FlaskConical className="h-4 w-4" />,
    },
    {
      title: "Görüşme Talebi Gönder",
      description: "Telefon, ziyaret veya platform üzerinden görüşme talebi açabileceksin.",
      icon: <Megaphone className="h-4 w-4" />,
    },
  ],
  representative: [
    {
      title: "Ürün Ekle",
      description: "Temsil ettiğin ürünleri sisteme ekleyip kampanya oluşturabileceksin.",
      icon: <Package className="h-4 w-4" />,
    },
    {
      title: "Numune Taleplerini Yönet",
      description: "Eczacılardan gelen numune taleplerini onaylayıp takip edebileceksin.",
      icon: <FlaskConical className="h-4 w-4" />,
    },
    {
      title: "Görüşme Taleplerini Yönet",
      description: "Gelen görüşme taleplerini kabul/reddedip randevuya çevirebileceksin.",
      icon: <Users className="h-4 w-4" />,
    },
  ],
  company: [
    {
      title: "Mümessillerini İzle",
      description: "Firmana bağlı mümessillerin performansını tek ekrandan göreceksin.",
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: "Kampanya Performansı",
      description: "Yayınlanan kampanyaların etkileşim verilerini izleyebileceksin.",
      icon: <Megaphone className="h-4 w-4" />,
    },
  ],
  admin: [
    {
      title: "Kullanıcı Yönetimi",
      description: "Kullanıcı onayı, askıya alma ve silme işlemlerini buradan yapacaksın.",
      icon: <Users className="h-4 w-4" />,
    },
  ],
};

function NextStepsCard({ role }: { role: keyof typeof ROLE_NEXT_STEPS }) {
  const steps = ROLE_NEXT_STEPS[role] ?? [];
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Sırada Ne Var?</CardTitle>
          <Badge variant="outline">Yakında</Badge>
        </div>
        <CardDescription>Bu modüller bir sonraki geliştirme fazında eklenecek.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((step) => (
          <div key={step.title} className="flex gap-3 rounded-md border border-border p-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
              {step.icon}
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">{step.title}</p>
              <p className="text-xs text-muted-foreground">{step.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
