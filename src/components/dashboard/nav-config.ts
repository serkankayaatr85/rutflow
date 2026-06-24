import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Search,
  Users,
  Megaphone,
  Package,
  FlaskConical,
  CalendarClock,
  Building2,
} from "lucide-react";

import type { UserRole } from "@/types";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

/**
 * Bu fazda (Auth + Roller) sadece Dashboard linki aktif çalışır.
 * Diğer linkler ilgili özellik (arama, kampanya, numune vb.)
 * geliştirildiğinde sayfalarıyla birlikte eklenecektir — şimdiden
 * navigasyonda yer almaları, rolün hangi modüllere sahip olacağını
 * netleştirmek içindir.
 */
export const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
  pharmacist: [
    { label: "Genel Bakış", href: "/dashboard", icon: LayoutDashboard },
    { label: "Ürün / Mümessil Ara", href: "/dashboard/search", icon: Search },
    { label: "Takip Ettiklerim", href: "/dashboard/follows", icon: Users },
    { label: "Kampanyalar", href: "/dashboard/campaigns", icon: Megaphone },
    { label: "Numune Taleplerim", href: "/dashboard/sample-requests", icon: FlaskConical },
    { label: "Görüşme Taleplerim", href: "/dashboard/meeting-requests", icon: CalendarClock },
  ],
  representative: [
    { label: "Genel Bakış", href: "/dashboard", icon: LayoutDashboard },
    { label: "Ürünlerim", href: "/dashboard/products", icon: Package },
    { label: "Kampanyalarım", href: "/dashboard/campaigns", icon: Megaphone },
    { label: "Numune Talepleri", href: "/dashboard/sample-requests", icon: FlaskConical },
    { label: "Görüşme Talepleri", href: "/dashboard/meeting-requests", icon: CalendarClock },
    { label: "Takipçilerim", href: "/dashboard/followers", icon: Users },
  ],
  company: [
    { label: "Genel Bakış", href: "/dashboard", icon: LayoutDashboard },
    { label: "Mümessillerim", href: "/dashboard/representatives", icon: Users },
    { label: "Kampanya Performansı", href: "/dashboard/campaigns", icon: Megaphone },
    { label: "Firma Profili", href: "/dashboard/company-profile", icon: Building2 },
  ],
  admin: [
    { label: "Genel Bakış", href: "/dashboard", icon: LayoutDashboard },
    { label: "Kullanıcılar", href: "/dashboard/users", icon: Users },
    { label: "Firmalar", href: "/dashboard/companies", icon: Building2 },
    { label: "Kampanyalar", href: "/dashboard/campaigns", icon: Megaphone },
  ],
};
