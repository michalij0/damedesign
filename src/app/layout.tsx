import type { Metadata, Viewport } from "next";
import { fontGeist, fontInter } from "./fonts";
import "./globals.css";
import { createClient } from "@/utils/supabase/server";
import MainLayout from "@/components/MainLayout";

export const metadata: Metadata = {
  title: "DameDesign - Projekty Graficzne",
  description: "Portfolio grafika komputerowego DameDesign.",
  icons: {
    icon: "/img/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("is_maintenance_mode")
    .single();

  const isMaintenanceMode = settings?.is_maintenance_mode || false;

  return (
    <html lang="pl">
      <head>
        <link
          href="https://fonts.cdnfonts.com/css/druk-wide-bold"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${fontGeist.variable} ${fontInter.variable} bg-black font-sans text-white`}
      >
        <MainLayout serverUser={user} isMaintenanceMode={isMaintenanceMode}>
          {children}
        </MainLayout>
      </body>
    </html>
  );
}
