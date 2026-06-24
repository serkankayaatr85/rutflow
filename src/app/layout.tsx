import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import "./globals.css";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RutFlow | Eczacı - Mümessil Ağı",
  description:
    "Eczacılar, tıbbi mümessiller ve firmaları dijital ortamda buluşturan profesyonel ağ platformu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={fontSans.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
