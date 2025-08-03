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
    // Przeładuj stronę, aby aktywować skrypty analityczne
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
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-4xl z-50 px-4"
        >
          <div className="p-4 bg-neutral-800/90 backdrop-blur-lg border border-neutral-700 rounded-xl shadow-lg flex flex-col md:flex-row items-center gap-4">
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
                <button onClick={handleDecline} className="px-4 py-2 text-sm text-neutral-300 hover:text-white">Odrzuć</button>
                <button onClick={handleAccept} className="px-4 py-2 text-sm bg-accent text-black rounded-lg font-bold">Akceptuj</button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
