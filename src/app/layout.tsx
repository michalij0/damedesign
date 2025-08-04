// src/app/layout.tsx
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
  
  // Pobieramy status trybu WIP z bazy danych
  let isMaintenanceMode = false;
  try {
    const { data: settings, error } = await supabase
      .from('site_settings')
      .select('is_maintenance_mode')
      .eq('singleton_check', true) // <-- To jest kluczowe!
      .single();
    
    if (error) {
      console.error("Błąd zapytania Supabase:", error);
      throw error;
    }
    
    isMaintenanceMode = settings?.is_maintenance_mode ?? false;
  } catch (error) {
    console.error("Błąd pobierania ustawień WIP:", error);
    isMaintenanceMode = process.env.MAINTENANCE_MODE === 'true'; // Fallback
  }

  return (
    <html lang="pl">
      <body className={`${GeistSans.className} bg-black text-neutral-200`}>
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