"use client";

import { Building2, Stethoscope, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import type { RegisterUserType } from "@/lib/validations/auth";

interface UserTypeOption {
  value: RegisterUserType;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const OPTIONS: UserTypeOption[] = [
  {
    value: "pharmacist",
    title: "Eczacı",
    description: "Ürün ve kampanyaları takip et, mümessillerle iletişime geç",
    icon: <Stethoscope className="h-5 w-5" />,
  },
  {
    value: "representative",
    title: "Tıbbi Mümessil",
    description: "Ürün ve kampanya yayınla, eczacı taleplerini yönet",
    icon: <Users className="h-5 w-5" />,
  },
  {
    value: "company",
    title: "Firma",
    description: "Mümessillerini ve kampanya performansını izle",
    icon: <Building2 className="h-5 w-5" />,
  },
];

interface UserTypeSelectorProps {
  value: RegisterUserType | null;
  onChange: (value: RegisterUserType) => void;
}

export function UserTypeSelector({ value, onChange }: UserTypeSelectorProps) {
  return (
    <div className="grid gap-3" role="radiogroup" aria-label="Kullanıcı tipi">
      {OPTIONS.map((option) => {
        const isSelected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(option.value)}
            className={cn(
              "flex w-full items-start gap-3 rounded-lg border p-4 text-left transition-colors",
              "hover:border-primary/60 hover:bg-secondary/40",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isSelected ? "border-primary bg-secondary/60" : "border-border bg-card"
            )}
          >
            <span
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                isSelected ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
              )}
            >
              {option.icon}
            </span>
            <span className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">{option.title}</span>
              <span className="text-xs text-muted-foreground">{option.description}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
