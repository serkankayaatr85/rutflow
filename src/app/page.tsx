import Link from "next/link";
import { redirect } from "next/navigation";
import { Stethoscope, Users, Megaphone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/supabase/queries";

export default async function HomePage() {
  const currentUser = await getCurrentUser();
  if (currentUser) {
    redirect("/dashboard");
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, hsl(var(--primary) / 0.10), transparent 40%), radial-gradient(circle at 85% 75%, hsl(var(--accent) / 0.12), transparent 45%)",
        }}
      />

      <div className="flex w-full max-w-md flex-col items-center text-center">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
          <Stethoscope className="h-7 w-7" />
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-foreground">RutFlow</h1>
        <p className="mt-3 text-base text-muted-foreground">
          Eczacıları, tıbbi mümessilleri ve firmaları aynı akışta buluşturan
          profesyonel iletişim ağı.
        </p>

        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="w-full">
            <Link href="/login">Giriş Yap</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full">
            <Link href="/register">Kayıt Ol</Link>
          </Button>
        </div>

        <div className="mt-12 grid w-full grid-cols-3 gap-4 text-left">
          <FeaturePill icon={<Users className="h-4 w-4" />} label="Eczacı" />
          <FeaturePill icon={<Megaphone className="h-4 w-4" />} label="Mümessil" />
          <FeaturePill icon={<Stethoscope className="h-4 w-4" />} label="Firma" />
        </div>
      </div>
    </main>
  );
}

function FeaturePill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-border bg-card px-3 py-4 text-card-foreground">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
        {icon}
      </span>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
    </div>
  );
}
