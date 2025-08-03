"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/server";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { ArrowLeft, UploadCloud } from "lucide-react";
import { CldUploadWidget, CldImage } from "next-cloudinary";
import type { CloudinaryUploadWidgetResults } from "next-cloudinary";
import { useNotification } from "@/context/NotificationProvider";

export default function NewTestimonialPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pola formularza
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const router = useRouter();
  const supabase = createClient();
  const { addNotification } = useNotification();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
      }
      setLoading(false);
    };
    getUser();
  }, [supabase, router]);

  const handleUploadSuccess = (results: CloudinaryUploadWidgetResults) => {
    if (results.info && typeof results.info === 'object' && 'secure_url' in results.info) {
      setAvatarUrl(results.info.secure_url);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await supabase.from("testimonials").insert({
      name: name,
      text: text,
      avatar_url: avatarUrl,
    });

    setIsSubmitting(false);

    if (error) {
      addNotification(`Błąd: ${error.message}`, "error");
    } else {
      addNotification("Nowa opinia została pomyślnie dodana!", "success");
      router.push("/");
      router.refresh();
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-black" />;
  }

  return (
    <main className="min-h-screen bg-black pt-24 pb-24">
      <div className="mx-auto max-w-4xl px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-8">
          <ArrowLeft size={16} />
          <span>Wróć na stronę główną</span>
        </Link>

        <h1 className="text-4xl font-bold font-mona-sans mb-2">
          Dodaj nową opinię
        </h1>
        <p className="text-neutral-400 mb-12">
          Wypełnij poniższe pola, aby dodać nową opinię do karuzeli.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-300 mb-2">Imię / Nazwa klienta</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Avatar klienta</label>
              <CldUploadWidget uploadPreset="ml_default" onSuccess={handleUploadSuccess}>
                {({ open }) => (
                  <button type="button" onClick={() => open()} className="w-full h-24 border-2 border-dashed border-neutral-700 rounded-lg flex items-center justify-center text-neutral-500 hover:border-accent hover:text-accent transition-colors">
                    {avatarUrl ? <CldImage src={avatarUrl} alt="Avatar" width={64} height={64} className="h-16 w-16 rounded-full" /> : ( <> <UploadCloud size={32} /> <span>Kliknij, aby wgrać</span> </> )}
                  </button>
                )}
              </CldUploadWidget>
            </div>
          </div>
          <div>
            <label htmlFor="text" className="block text-sm font-medium text-neutral-300 mb-2">Treść opinii</label>
            <textarea id="text" rows={6} value={text} onChange={(e) => setText(e.target.value)} required className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white"></textarea>
          </div>
          <div className="flex justify-end pt-4">
            <button type="submit" disabled={isSubmitting} className="bg-accent text-black font-bold px-8 py-3 rounded-lg hover:bg-accent-muted transition-colors disabled:bg-neutral-600">
              {isSubmitting ? "Zapisywanie..." : "Zapisz opinię"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
