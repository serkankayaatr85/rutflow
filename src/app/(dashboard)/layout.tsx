import { redirect } from "next/navigation";

import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { getCurrentUser } from "@/lib/supabase/queries";
import { ROLE_LABELS } from "@/types";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const { profile } = currentUser;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role={profile.role} />
      <div className="flex flex-1 flex-col">
        <Header fullName={profile.full_name} roleLabel={ROLE_LABELS[profile.role]} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
