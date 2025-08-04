import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

// Importujemy Providers i MainLayout
import { Providers } from "./providers";
import MainLayout from '@/components/MainLayout';
import { createClient } from '@/utils/supabase/server';

export const metadata: Metadata = {
  title: "DameDesign",
  description: "Portfolio i usługi projektowe.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === 'true';

  return (
    <html lang="pl">
      <body className={`${GeistSans.className} bg-black text-neutral-200`}>
        {/* ---> ZMIANA: Przenosimy <Providers> na zewnątrz <MainLayout> */}
        <Providers>
          <MainLayout serverUser={user} isMaintenanceMode={isMaintenanceMode}>
            {children}
          </MainLayout>
        </Providers>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}