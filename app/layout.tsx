import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { cn } from "@/lib/utils";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Yonko Tech Consulting",
  description:
    "Yonko Tech Consulting – Expert en solutions digitales, data et cloud. Construisez vos produits et plateformes avec une équipe senior.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background text-foreground antialiased font-sans")}>
        <div className="flex min-h-screen flex-col bg-background text-foreground">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
        <Toaster position="top-right" expand />
      </body>
    </html>
  );
}
