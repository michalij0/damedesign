"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useEffect, useState } from "react";

// Deklarujemy dla TypeScript, że funkcja gtag będzie istniała w obiekcie window
declare global {
  interface Window {
    gtag: (
      command: 'config',
      targetId: string,
      config?: { [key: string]: any }
    ) => void;
  }
}

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    const consentValue = localStorage.getItem('cookie_consent');
    setConsent(consentValue === 'accepted');
  }, []);

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || typeof window.gtag !== 'function' || !consent) {
      return;
    }
    const url = pathname + searchParams.toString();
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }, [pathname, searchParams, consent]);

  if (!GA_MEASUREMENT_ID || !consent) {
    if (!GA_MEASUREMENT_ID) {
        console.warn("Google Analytics Measurement ID is not set. Analytics will be disabled.");
    }
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}
