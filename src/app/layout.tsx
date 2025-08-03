// src/app/layout.tsx
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";

// ---> ZMIANA 1: Importujemy nasz nowy komponent Providers
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "DameDesign",
  description: "Portfolio i usługi projektowe.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className={GeistSans.className}>
        <Providers>
          {children}
        </Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}