"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "O mnie", href: "/#o-mnie" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Kontakt", href: "/#kontakt" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);

      if (pathname === "/") {
        const sections = navLinks
          .filter((link) => link.href.startsWith("/#"))
          .map((link) => document.getElementById(link.href.substring(2)))
          .filter(Boolean) as HTMLElement[];

        let currentSection = "";
        for (const section of sections) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            currentSection = section.id;
            break;
          }
        }
        setActiveSection(currentSection);
      }
    };

    if (pathname === "/") {
      window.addEventListener("scroll", handleScroll);
      handleScroll();
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      setActiveSection(pathname);
      const handleSimpleScroll = () => setScrolled(window.scrollY > 10);
      window.addEventListener("scroll", handleSimpleScroll);
      handleSimpleScroll();
      return () => window.removeEventListener("scroll", handleSimpleScroll);
    }
  }, [pathname]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      
      // ---> POCZĄTEK POPRAWKI: Dodana linia do czyszczenia adresu URL <---
      // Modyfikuje historię przeglądarki, usuwając hash, bez przeładowania strony.
      window.history.replaceState(null, '', pathname);
      // ---> KONIEC POPRAWKI <---

      setActiveSection("");
    }
    setIsMenuOpen(false);
  };

  const getIsActive = (href: string) => {
    if (href.startsWith("/#")) {
      return activeSection === href.substring(2);
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full px-4 sm:px-6 py-4 sm:py-6 z-30 transition-all duration-300 ${
          scrolled || isMenuOpen ? "bg-black/50 backdrop-blur-lg" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
          <div className="flex items-center">
            <Link href="/" onClick={handleLogoClick}>
              <Image
                src="/img/logo.svg"
                alt="DameDesign Logo"
                width={140}
                height={40}
                className="h-6 sm:h-8 w-auto flex-shrink-0"
              />
            </Link>
          </div>

          <nav className="hidden md:block">
            <ul className="flex items-center gap-6 sm:gap-8 font-inter">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`inline-block transition-all duration-300 hover:scale-105 text-sm sm:text-base ${
                      getIsActive(link.href)
                        ? "text-accent"
                        : "text-neutral-400 hover:text-accent-muted"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white z-40 relative p-1">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-lg z-20 pt-20 sm:pt-24 px-6 md:hidden"
          >
            <nav className="flex items-center justify-center min-h-[calc(100vh-80px)]">
              <ul className="flex flex-col items-center gap-8 font-inter">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`inline-block text-2xl sm:text-3xl transition-colors duration-300 ${
                        getIsActive(link.href)
                          ? "text-accent"
                          : "text-neutral-300 hover:text-accent-muted"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}