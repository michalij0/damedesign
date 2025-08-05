import Link from 'next/link';
import { Wrench } from 'lucide-react'; 

export default function MaintenancePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white text-center p-6">
      <Wrench size={64} className="text-accent mb-6" />
      <h1 className="text-4xl font-bold font-druk-wide mb-2">Strona w budowie</h1>
      <p className="text-neutral-400 max-w-md mb-8">
        Obecnie pracuję nad nowymi funkcjami. <br />
        Zapraszam wkrótce!
      </p>
      <Link href="/login" className="px-6 py-3 text-sm font-medium text-black bg-neutral-700 rounded-full hover:bg-neutral-600 transition-colors">
        Panel Administratora
      </Link>
    </div>
  );
}
