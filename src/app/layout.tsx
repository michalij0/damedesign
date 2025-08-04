import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Providers } from "./providers";

// ---> ZMIANA: Dodajemy importy dla MainLayout i Supabase
import MainLayout from '@/components/MainLayout';
import { createClient } from '@/utils/supabase/server';

export const metadata: Metadata = {
  title: "DameDesign",
  description: "Portfolio i usługi projektowe.",
};

// ---> ZMIANA: Zmieniamy funkcję na 'async'
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // ---> ZMIANA: Pobieramy dane potrzebne dla MainLayout
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === 'true';

  return (
    <html lang="pl">
      <body className={`${GeistSans.className} bg-black text-neutral-200`}>
        {/* ---> ZMIANA: Opakowujemy całą zawartość w MainLayout, przekazując dane */}
        <MainLayout serverUser={user} isMaintenanceMode={isMaintenanceMode}>
          <Providers>
            {children}
          </Providers>
        </MainLayout>
        <SpeedInsights />
      </body>
    </html>
  );
}