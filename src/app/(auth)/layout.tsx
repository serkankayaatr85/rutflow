import Link from "next/link";
import { Stethoscope } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-muted/40 px-4 py-10">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Stethoscope className="h-5 w-5" />
        </span>
        <span className="text-lg font-bold tracking-tight text-foreground">RutFlow</span>
      </Link>

      <div className="w-full max-w-md">{children}</div>
    </main>
  );
}
