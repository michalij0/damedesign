import type { Metadata } from "next";
import HomePageClient from "@/components/HomePageClient";
// UWAGA: Importy dla MainLayout i Supabase zostały usunięte
// bo logika przeniosła się do pliku layout.tsx

export const metadata: Metadata = {
  title: "DameDesign - Projekty Graficzne Dopasowane do Twoich Potrzeb",
  description: "Profesjonalne portfolio grafika. Specjalizuję się w brandingu, projektach digital, DTP i ilustracjach. Zobacz moje prace i stwórzmy razem coś niesamowitego.",
  keywords: ["grafik", "projektowanie graficzne", "portfolio", "branding", "logo", "DTP", "ilustracje", "Damian Tomasik"],
  authors: [{ name: "Damian Tomasik", url: "https://damedesign.pl" }],
  creator: "Damian Tomasik",
  
  // Tagi Open Graph (dla Facebooka, LinkedIn, etc.)
  openGraph: {
    title: "DameDesign - Profesjonalne Projekty Graficzne",
    description: "Portfolio grafika specjalizującego się w brandingu, DTP i ilustracjach.",
    url: "https://damedesign.pl",
    siteName: "DameDesign",
    images: [
      {
        url: 'https://damedesign.pl/og-image.png',
        width: 1200,
        height: 630,
        alt: 'DameDesign - Projekty Graficzne',
      },
    ],
    locale: 'pl_PL',
    type: 'website',
  },

  // Tagi Twitter Card (dla Twittera/X)
  twitter: {
    card: 'summary_large_image',
    title: 'DameDesign - Profesjonalne Projekty Graficzne',
    description: 'Portfolio grafika specjalizującego się w brandingu, DTP i ilustracjach.',
    images: ['https://damedesign.pl/og-image.png'],
  },

  // Instrukcje dla robotów Google
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// UWAGA: Funkcja Home nie musi już być asynchroniczna, ponieważ nie pobiera danych serwerowych
// i nie renderuje MainLayout.
export default function Home() {
  // UWAGA: Usunięto logikę pobierania danych, bo jest w pliku layout.tsx
  // Nie opakowujemy już w MainLayout, bo jest w głównym layoucie.
  return (
    <HomePageClient />
  );
}