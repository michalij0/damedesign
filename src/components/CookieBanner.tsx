"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie } from 'lucide-react';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (consent === null) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setShowBanner(false);
    // Przeładuj stronę, aby aktywować skrypty analityczne, jeśli są dodawane warunkowo
    window.location.reload(); 
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'declined');
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: "0%" }}
          exit={{ y: "100%" }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          // ---> ZMIANA 1: Ten kontener zajmuje się tylko pozycjonowaniem na dole ekranu.
          // Dodajemy padding, aby baner nie dotykał krawędzi na małych ekranach.
          className="fixed bottom-0 inset-x-0 z-50 p-4"
        >
          {/* ---> ZMIANA 2: Ten wewnętrzny div zajmuje się wyglądem i wyśrodkowaniem. */}
          {/* `mx-auto` centruje go, a `max-w-4xl` ogranicza szerokość na dużych ekranach. */}
          <div className="mx-auto max-w-4xl p-4 bg-neutral-800/90 backdrop-blur-lg border border-neutral-700 rounded-xl shadow-lg flex flex-col md:flex-row items-center gap-4">
            <div className="flex-shrink-0">
              <Cookie size={32} className="text-accent" />
            </div>
            <p className="flex-grow text-white text-sm text-center md:text-left">
              Używamy plików cookie do analizy ruchu na stronie i ulepszania Twoich doświadczeń. Twoja prywatność jest dla nas ważna. Więcej informacji znajdziesz w naszej{' '}
              <Link href="/polityka-prywatnosci" className="underline hover:text-accent">
                polityce prywatności
              </Link>.
            </p>
            <div className="flex-shrink-0 flex items-center gap-3">
                <button onClick={handleDecline} className="px-4 py-2 text-sm text-neutral-300 hover:text-white transition-colors">Odrzuć</button>
                <button onClick={handleAccept} className="px-4 py-2 text-sm bg-accent text-black rounded-lg font-bold transition-colors hover:bg-accent-muted">Akceptuj</button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}