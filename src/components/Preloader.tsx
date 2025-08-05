"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // localStorage
    const hasVisited = localStorage.getItem("hasVisitedDameDesign");

    if (hasVisited) {
      setIsLoading(false);
      return;
    }

   
    const timer = setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem("hasVisitedDameDesign", "true");
    }, 2500); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 bg-black flex items-center justify-center z-50"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            <Image
              src="/img/logo.svg"
              alt="DameDesign Logo"
              width={250}
              height={80}
              priority
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
