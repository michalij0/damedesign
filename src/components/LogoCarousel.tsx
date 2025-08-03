"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import { PlusCircle, Trash2 } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import type { CloudinaryUploadWidgetResults } from "next-cloudinary";
import { useNotification } from "@/context/NotificationProvider";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

// Definiujemy typ danych dla logo
interface Logo {
  id: number;
  name: string;
  logo_url: string;
  alt_text: string;
}

export default function LogoCarousel() {
  const [user, setUser] = useState<User | null>(null);
  const [logos, setLogos] = useState<Logo[]>([]);
  const [loading, setLoading] = useState(true);
  const [logoToDelete, setLogoToDelete] = useState<Logo | null>(null);

  const supabase = createClient();
  const { addNotification } = useNotification();

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      const { data } = await supabase
        .from("logos")
        .select("*")
        .order("created_at", { ascending: false });
      setLogos(data || []);
      setLoading(false);
    };
    fetchData();
  }, [supabase]);

  const handleUploadSuccess = async (results: CloudinaryUploadWidgetResults) => {
    if (
      results.info &&
      typeof results.info === "object" &&
      "secure_url" in results.info
    ) {
      const info = results.info; // Lepsza praktyka
      const originalFilename =
        (info as any).original_filename || "Nowe Logo";
      const newLogo = {
        name: originalFilename,
        logo_url: info.secure_url,
        alt_text: `Logo klienta: ${originalFilename}`,
      };
      const { data, error } = await supabase
        .from("logos")
        .insert(newLogo)
        .select()
        .single();
      if (error) {
        addNotification(`Błąd: ${error.message}`, "error");
      } else if (data) {
        setLogos((prevLogos) => [data, ...prevLogos]);
        addNotification("Logo zostało dodane.", "success");
      }
    }
  };

  const handleDelete = async () => {
    if (!logoToDelete) return;
    const { error } = await supabase
      .from("logos")
      .delete()
      .eq("id", logoToDelete.id);
    if (error) {
      addNotification(`Błąd: ${error.message}`, "error");
    } else {
      setLogos(logos.filter((l) => l.id !== logoToDelete.id));
      addNotification("Logo zostało usunięte.", "success");
    }
    setLogoToDelete(null);
  };

  // ---> ZMIANA: Usunęliśmy całą logikę z pętlą 'while' i MIN_CAROUSEL_ITEMS.
  // Jest ona niepotrzebna i powodowała problem.

  if (loading) {
    return <div className="h-24 bg-black" />;
  }

  return (
    <>
      <div className="py-12 bg-black relative">
        {user && (
          <div className="absolute top-4 right-6 z-10">
            <CldUploadWidget
              uploadPreset="ml_default"
              onSuccess={handleUploadSuccess}
            >
              {({ open }) => (
                <button
                  onClick={() => open()}
                  className="group inline-flex items-center gap-2 rounded-full bg-neutral-800 px-3 py-1 text-xs font-medium text-neutral-300 transition-colors hover:bg-accent hover:text-black"
                >
                  <PlusCircle size={14} />
                  <span>Dodaj logo</span>
                </button>
              )}
            </CldUploadWidget>
          </div>
        )}
        {logos.length > 0 ? (
          <div className="group w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear_gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
            {/* ---> ZMIANA: Dublujemy listę logotypów tutaj, aby stworzyć płynną pętlę */}
            <ul className="flex items-center justify-center animate-infinite-scroll group-hover:[animation-play-state:paused]">
              {logos.map((logo, index) => (
                <li
                  key={`${logo.id}-${index}`}
                  className="mx-12 flex-shrink-0 relative group/item"
                >
                  <Image
                    src={logo.logo_url}
                    alt={logo.alt_text || `Logo klienta ${logo.name}`}
                    width={140}
                    height={50}
                    className="h-12 w-auto object-contain filter grayscale brightness-50 opacity-60 transition-all duration-300 hover:grayscale-0 hover:brightness-100 hover:opacity-100"
                  />
                  {user && (
                    <button
                      onClick={() => setLogoToDelete(logo)}
                      className="absolute -top-2 -right-2 p-1 bg-red-600 rounded-full text-white opacity-0 group-hover/item:opacity-100 transition-opacity"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </li>
              ))}
            </ul>
            {/* ---> ZMIANA: Dodajemy drugą, identyczną listę, aby animacja była płynna.
                 `aria-hidden` jest dla czytników ekranu, aby nie czytały tej samej listy dwa razy. */}
            <ul className="flex items-center justify-center animate-infinite-scroll group-hover:[animation-play-state:paused]" aria-hidden="true">
              {logos.map((logo, index) => (
                <li
                  key={`${logo.id}-duplicate-${index}`}
                  className="mx-12 flex-shrink-0 relative group/item"
                >
                  <Image
                    src={logo.logo_url}
                    alt={logo.alt_text || `Logo klienta ${logo.name}`}
                    width={140}
                    height={50}
                    className="h-12 w-auto object-contain filter grayscale brightness-50 opacity-60 transition-all duration-300 hover:grayscale-0 hover:brightness-100 hover:opacity-100"
                  />
                  {user && (
                    <button
                      onClick={() => setLogoToDelete(logo)}
                      className="absolute -top-2 -right-2 p-1 bg-red-600 rounded-full text-white opacity-0 group-hover/item:opacity-100 transition-opacity"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="mx-auto max-w-7xl px-6 text-center py-8 border border-dashed border-neutral-800 rounded-xl">
            <h3 className="text-lg font-bold text-neutral-400">
              Brak logotypów do wyświetlenia.
            </h3>
            {user && (
              <p className="text-neutral-500 mt-1 text-sm">
                Kliknij 'Dodaj logo', aby dodać pierwsze.
              </p>
            )}
          </div>
        )}
      </div>
      <DeleteConfirmationModal
        isOpen={!!logoToDelete}
        onClose={() => setLogoToDelete(null)}
        onConfirm={handleDelete}
        projectName={logoToDelete?.name || "to logo"}
      />
    </>
  );
}