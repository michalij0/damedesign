"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { ArrowLeft, UploadCloud } from "lucide-react";
import { CldUploadWidget, CldImage } from "next-cloudinary";
import type { CloudinaryUploadWidgetResults } from "next-cloudinary";
import { useNotification } from "@/context/NotificationProvider";

interface AboutData {
  heading: string;
  description: string;
  image_url: string;
}

export default function EditAboutPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<AboutData>>({});

  const router = useRouter();
  const supabase = createBrowserClient();
  const { addNotification } = useNotification();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);

      const { data } = await supabase.from("about_section").select("*").single();
      if (data) {
        setFormData(data);
      }
      setLoading(false);
    };
    fetchData();
  }, [supabase, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUploadSuccess = (fieldName: keyof AboutData) => (results: CloudinaryUploadWidgetResults) => {
    const info = results?.info;

    if (
      info &&
      typeof info === "object" &&
      "secure_url" in info &&
      typeof info.secure_url === "string"
    ) {
      setFormData(prev => ({
        ...prev,
        [fieldName]: info.secure_url
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await supabase
      .from("about_section")
      .update({
        heading: formData.heading,
        description: formData.description,
        image_url: formData.image_url,
      })
      .eq("singleton_check", true);

    setIsSubmitting(false);

    if (error) {
      addNotification(`Błąd: ${error.message}`, "error");
    } else {
      addNotification("Sekcja 'O mnie' została zaktualizowana!", "success");
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

        <h1 className="text-4xl font-bold font-mona-sans mb-2">Edytuj sekcję &quot;O mnie&quot;</h1>
        <p className="text-neutral-400 mb-12">Zmień dane i zapisz, aby zaktualizować stronę główną.</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label htmlFor="heading" className="block text-sm font-medium text-neutral-300 mb-2">Nagłówek</label>
            <input type="text" id="heading" name="heading" value={formData.heading || ''} onChange={handleInputChange} required className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-neutral-300 mb-2">Opis</label>
            <textarea id="description" name="description" rows={8} value={formData.description || ''} onChange={handleInputChange} required className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Twoje zdjęcie (hero.png)</label>
            <CldUploadWidget uploadPreset="ml_default" onSuccess={handleUploadSuccess('image_url')}>
              {({ open }) => (
                <button type="button" onClick={() => open()} className="w-full h-48 border-2 border-dashed border-neutral-700 rounded-lg flex flex-col items-center justify-center text-neutral-500 hover:border-accent hover:text-accent transition-colors">
                  {formData.image_url
                    ? <CldImage src={formData.image_url} alt="Twoje zdjęcie" width={150} height={150} className="max-h-full w-auto" />
                    : (
                      <>
                        <UploadCloud size={32} />
                        <span>Kliknij, aby wgrać</span>
                      </>
                    )}
                </button>
              )}
            </CldUploadWidget>
          </div>
          <div className="flex justify-end pt-4">
            <button type="submit" disabled={isSubmitting} className="bg-accent text-black font-bold px-8 py-3 rounded-lg hover:bg-accent-muted transition-colors disabled:bg-neutral-600">
              {isSubmitting ? "Zapisywanie..." : "Zapisz zmiany"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
