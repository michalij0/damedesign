"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useParams } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { ArrowLeft, UploadCloud } from "lucide-react";
import { CldUploadWidget, CldImage } from "next-cloudinary";
import type { CloudinaryUploadWidgetResults } from "next-cloudinary";
import { useNotification } from "@/context/NotificationProvider";
import MainLayout from '@/components/MainLayout';

export default function EditTestimonialPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pola formularza
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const router = useRouter();
  const params = useParams();
  const supabase = createClient();
  const { addNotification } = useNotification();
  
  const { id } = params;

  useEffect(() => {
    if (!id) {
      return;
    }
  

    const fetchData = async () => {
      // Sprawdzamy autoryzację użytkownika
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);


      const testimonialId = Array.isArray(id) ? id[0] : id;
      const { data: testimonialData, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("id", testimonialId)
        .single();
      
      if (error) {
        addNotification("Nie udało się pobrać danych opinii.", "error");
        setLoading(false);
        return;
      }

      if (testimonialData) {
        setName(testimonialData.name);
        setText(testimonialData.text);
        setAvatarUrl(testimonialData.avatar_url);
      }
      setLoading(false);
    };

    fetchData();
  }, [id, supabase, router, addNotification]); // dodajemy addNotification do dependency array

  const handleUploadSuccess = (results: CloudinaryUploadWidgetResults) => {
    if (results.info && typeof results.info === 'object' && 'secure_url' in results.info) {
      setAvatarUrl(results.info.secure_url);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const testimonialId = Array.isArray(id) ? id[0] : id;
    const { error } = await supabase
      .from("testimonials")
      .update({
        name: name,
        text: text,
        avatar_url: avatarUrl,
      })
      .eq("id", testimonialId);

    setIsSubmitting(false);

    if (error) {
      addNotification(`Błąd podczas aktualizacji: ${error.message}`, "error");
    } else {
      addNotification("Opinia została pomyślnie zaktualizowana!", "success");
      router.push("/");
      router.refresh();
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center"><p className="text-white">Ładowanie danych...</p></div>;
  }

  return (
    <main className="min-h-screen bg-black pt-24 pb-24">
      <div className="mx-auto max-w-4xl px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-8">
          <ArrowLeft size={16} />
          <span>Wróć na stronę główną</span>
        </Link>

        <h1 className="text-4xl font-bold font-mona-sans mb-2">
          Edytuj opinię
        </h1>
        <p className="text-neutral-400 mb-12">
          Zmień dane opinii i zapisz zmiany.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-300 mb-2">Imię / Nazwa klienta</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:ring-accent focus:border-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Avatar klienta</label>
              <CldUploadWidget uploadPreset="ml_default" onSuccess={handleUploadSuccess}>
                {({ open }) => (
                  <button type="button" onClick={() => open()} className="w-full h-24 border-2 border-dashed border-neutral-700 rounded-lg flex items-center justify-center gap-2 text-neutral-500 hover:border-accent hover:text-accent transition-colors">
                    {avatarUrl ? <CldImage src={avatarUrl} alt="Avatar" width={64} height={64} className="h-16 w-16 rounded-full object-cover" /> : ( <> <UploadCloud size={24} /> <span>Kliknij, aby wgrać</span> </> )}
                  </button>
                )}
              </CldUploadWidget>
            </div>
          </div>
          <div>
            <label htmlFor="text" className="block text-sm font-medium text-neutral-300 mb-2">Treść opinii</label>
            <textarea id="text" rows={6} value={text} onChange={(e) => setText(e.target.value)} required className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:ring-accent focus:border-accent"></textarea>
          </div>
          <div className="flex justify-end pt-4">
            <button type="submit" disabled={isSubmitting} className="bg-accent text-black font-bold px-8 py-3 rounded-lg hover:bg-accent-muted transition-colors disabled:bg-neutral-600 disabled:cursor-not-allowed">
              {isSubmitting ? "Zapisywanie..." : "Zapisz zmiany"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}