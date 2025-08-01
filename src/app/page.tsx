import type { Metadata } from "next";
import HomePageClient from "@/components/HomePageClient";

// Metadane dla SEO
export const metadata: Metadata = {
  title: "DameDesign - Projekty Graficzne Dopasowane do Twoich Potrzeb",
  description: "Profesjonalne portfolio grafika. Specjalizuję się w brandingu, projektach digital, DTP i ilustracjach. Zobacz moje prace i stwórzmy razem coś niesamowitego.",
  keywords: ["grafik", "projektowanie graficzne", "portfolio", "branding", "logo", "DTP", "ilustracje"],
};

export default function Home() {
  // Renderujemy komponent kliencki, który zawiera cały wygląd
  return <HomePageClient />;
}
