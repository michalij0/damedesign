"use client";

import Link from "next/link";
import { useState } from "react";
import { Settings } from "lucide-react";

export default function Footer() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("michalij");
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <footer className="w-full border-t border-neutral-800 p-6">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <h2 className="font-druk-wide text-2xl font-bold leading-tight">
            Stwórzmy wspólnie coś niesamowitego
          </h2>
          <Link
            href="/#kontakt"
            className="mt-4 inline-block rounded-full bg-accent px-5 py-3 font-inter text-sm font-medium text-black hover:bg-accent-muted transition-colors"
          >
            Napisz do mnie &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-8 md:col-span-2">
          <div>
            <h3 className="font-inter text-sm text-neutral-400">Strony</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/portfolio" className="text-white hover:text-accent transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/#o-mnie" className="text-white hover:text-accent transition-colors">
                  O mnie
                </Link>
              </li>
              <li>
                <Link href="/#kontakt" className="text-white hover:text-accent transition-colors">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-inter text-sm text-neutral-400">Sociale</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="https://www.behance.net/damedsgn" target="_blank" rel="noopener noreferrer" className="text-white hover:text-accent transition-colors">
                  Behance
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/dame.dsgn/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-accent transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/damian-tomasik-5a3967204/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-accent transition-colors">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-7xl border-t border-neutral-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-neutral-500">
        <p className="text-center sm:text-left">
          &copy; {new Date().getFullYear()} DameDesign. All rights reserved. |
          Created with ❤️ by{" "}
          <button
            onClick={handleCopy}
            className="font-medium text-current transition-colors hover:text-accent focus:outline-none"
          >
            {copied ? "Skopiowano tag Discord!" : "Michalij"}
          </button>
          <span className="hidden sm:inline"> | </span>
          <br className="sm:hidden" />
          <Link
            href="/polityka-prywatnosci"
            className="hover:text-white transition-colors"
          >
            Polityka Prywatności
          </Link>
        </p>
        <Link
          href="/login"
          className="text-neutral-600 hover:text-accent transition-colors"
        >
          <Settings size={20} />
        </Link>
      </div>
    </footer>
  );
}