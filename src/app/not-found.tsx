import Link from 'next/link';
import { TriangleAlert } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black text-white text-center p-6">
      <TriangleAlert size={64} className="text-accent mb-6" />
      <h1 className="text-6xl font-bold font-druk-wide mb-2">404</h1>
      <h2 className="text-3xl font-bold font-mona-sans mb-4">
        Strona nie została znaleziona :(
      </h2>
      <p className="text-neutral-400 max-w-md mb-8">
        Wygląda na to, że strona, której szukasz, nie istnieje lub została przeniesiona.
      </p>
      <Link 
        href="/" 
        className="inline-block rounded-full bg-accent px-8 py-4 font-inter text-lg font-medium text-black transition-transform hover:scale-105"
      >
        Wróć na stronę główną
      </Link>
    </main>
  );
}
