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
            className="mt-4 inline-block rounded-full bg-accent px-5 py-3 font-inter text-sm font-medium text-black"
          >
            Let's connect &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-8 md:col-span-2">
          <div>
            <h3 className="font-inter text-sm text-neutral-400">Pages</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/portfolio">Portfolio</Link>
              </li>
              <li>
                <Link href="/#o-mnie">About</Link>
              </li>
              <li>
                <Link href="/#kontakt">Contact</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-inter text-sm text-neutral-400">Socials</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" target="_blank">
                  Twitter (X)
                </a>
              </li>
              <li>
                <a href="#" target="_blank">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" target="_blank">
                  Dribbble
                </a>
              </li>
              <li>
                <a href="#" target="_blank">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-7xl border-t border-neutral-800 pt-6 flex justify-between items-center text-sm text-neutral-500">
        <p>
          &copy; {new Date().getFullYear()} DameDesign. All rights reserved. |
          Created with ❤️ by{" "}
          <button
            onClick={handleCopy}
            className="font-medium text-white transition-colors hover:text-accent focus:outline-none"
          >
            {copied ? "Skopiowano tag Discord! Napisz do mnie na Discordzie!" : "Michalij"}
          </button>
        </p>
        <Link href="/login" className="text-neutral-600 hover:text-accent transition-colors">
            <Settings size={20} />
        </Link>
      </div>
    </footer>
  );
}
