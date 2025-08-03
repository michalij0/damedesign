// src/components/MainLayout.tsx
"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import MaintenancePage from "./MaintenancePage";
import GoogleAnalytics from "./GoogleAnalytics";
import Preloader from "./Preloader";
import Header from "./Header";
import Footer from "./Footer";
import AdminNotifier from "./AdminNotifier";
import CookieBanner from "./CookieBanner";
import ProgressBar from "./ProgressBar";
import { NotificationProvider } from "@/context/NotificationProvider"; // Wracamy do importu tutaj

interface MainLayoutProps {
  children: React.ReactNode;
  serverUser: User | null;
  isMaintenanceMode: boolean;
}

export default function MainLayout({ children, serverUser, isMaintenanceMode }: MainLayoutProps) {
  const pathname = usePathname();
  const [user, setUser] = useState(serverUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const checkUser = async () => {
        const { data } = await supabase.auth.getUser();
        setUser(data.user);
        setLoading(false);
    }
    checkUser();

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  if (loading && isMaintenanceMode && !serverUser) {
      return <div className="bg-black min-h-screen" />;
  }

  const showMaintenancePage = isMaintenanceMode && !user && pathname !== "/login";

  if (showMaintenancePage) {
    return <MaintenancePage />;
  }

  return (
    // Używamy NotificationProvider jako głównego "opakowania"
    <NotificationProvider>
      <Suspense fallback={null}>
        <GoogleAnalytics />
        <ProgressBar />
      </Suspense>
      
      <Preloader />
      <Header />
      <main>{children}</main>
      <Footer />
      {user && <AdminNotifier />}
      <CookieBanner />
      <div id="portal-root"></div>
    </NotificationProvider>
  );
}