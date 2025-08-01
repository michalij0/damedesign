import type { Metadata, Viewport } from "next";
import { fontGeist, fontInter } from "./fonts";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import { NotificationProvider } from "@/context/NotificationProvider";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        <NotificationProvider>
          <Preloader />
          <Header />
          <main>{children}</main>
          <Footer />
        </NotificationProvider>
        <div id="portal-root"></div> {/* To jest kluczowe dla popupów */}
      </body>
    </html>
  );
}
