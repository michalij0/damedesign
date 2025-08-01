"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UploadCloud } from "lucide-react";
import { CldUploadWidget, CldImage } from "next-cloudinary";
import type { CloudinaryUploadWidgetResults } from "next-cloudinary";
import { useNotification } from "@/context/NotificationProvider";
import dynamic from "next/dynamic";

const ContentEditor = dynamic(() => import("@/components/ContentEditor"), {
  ssr: false,
  loading: () => <div className="w-full min-h-[300px] bg-neutral-900 border border-neutral-700 rounded-lg flex items-center justify-center text-neutral-500">Ładowanie edytora...</div>,
});

// Definiujemy typ danych projektu
interface Project {
  id: number;
  title: string;
  tags: string;
  category: string;
  year: string;
  introduction: string;
  thumbnail_url: string;
  main_image_url: string;
  content: string;
  slug: string;
}

export default function EditProjectForm({ project }: { project: Project }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pola formularza
  const [title, setTitle] = useState(project.title);
  const [tags, setTags] = useState(project.tags.replace(/ • /g, ', ')); // Konwertuj z powrotem na przecinki
  const [category, setCategory] = useState(project.category);
  const [year, setYear] = useState(project.year);
  const [introduction, setIntroduction] = useState(project.introduction);
  const [thumbnailUrl, setThumbnailUrl] = useState(project.thumbnail_url);
  const [mainImageUrl, setMainImageUrl] = useState(project.main_image_url);
  const [content, setContent] = useState(project.content);

  const router = useRouter();
  const supabase = createClient();
  const { addNotification } = useNotification();
  
  const createSlug = (title: string) => {
    return title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formattedTags = tags.split(',').map(tag => tag.trim()).join(' • ');
    const slug = createSlug(title);

    const { error } = await supabase
      .from("projects")
      .update({
        title: title,
        tags: formattedTags,
        category: category,
        year: year,
        introduction: introduction,
        thumbnail_url: thumbnailUrl,
        main_image_url: mainImageUrl,
        slug: slug,
        content: content, 
      })
      .eq('id', project.id);

    setIsSubmitting(false);

    if (error) {
      addNotification(`Błąd: ${error.message}`, "error");
    } else {
      addNotification("Projekt został pomyślnie zaktualizowany!", "success");
      router.push("/portfolio");
      router.refresh();
    }
  };

  const handleUploadSuccess = (setter: (url: string) => void) => (results: CloudinaryUploadWidgetResults) => {
    if (results.info && typeof results.info === 'object' && 'secure_url' in results.info) {
      setter(results.info.secure_url);
    }
  };

  return (
    <main className="min-h-screen bg-black pt-24 pb-24">
      <div className="mx-auto max-w-4xl px-6">
        <Link href="/portfolio" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-8">
          <ArrowLeft size={16} />
          <span>Wróć do portfolio</span>
        </Link>

        <h1 className="text-4xl font-bold font-mona-sans mb-2">Edytuj projekt</h1>
        <p className="text-neutral-400 mb-12">Zmień dane projektu i zapisz zmiany.</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-neutral-300 mb-2">Tytuł projektu</label>
                <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent" />
              </div>
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-neutral-300 mb-2">Tagi (oddzielone przecinkami)</label>
                <input type="text" id="tags" value={tags} onChange={(e) => setTags(e.target.value)} required placeholder="np. Branding, Social Media, 2024" className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-neutral-300 mb-2">Kategoria</label>
                <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} required className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent" />
              </div>
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-neutral-300 mb-2">Rok</label>
                <input type="text" id="year" value={year} onChange={(e) => setYear(e.target.value)} required className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent" />
              </div>
            </div>
            <div>
              <label htmlFor="introduction" className="block text-sm font-medium text-neutral-300 mb-2">Wstęp (krótki opis projektu)</label>
              <textarea id="introduction" rows={4} value={introduction} onChange={(e) => setIntroduction(e.target.value)} required className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent"></textarea>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Thumbnail (miniaturka)</label>
              <CldUploadWidget uploadPreset="ml_default" onSuccess={handleUploadSuccess(setThumbnailUrl)}>
                {({ open }) => (
                  <button type="button" onClick={() => open()} className="w-full h-48 border-2 border-dashed border-neutral-700 rounded-lg flex flex-col items-center justify-center text-neutral-500 hover:border-accent hover:text-accent transition-colors">
                    {thumbnailUrl ? <CldImage src={thumbnailUrl} alt="Thumbnail" width={150} height={150} className="max-h-full w-auto" /> : ( <> <UploadCloud size={32} /> <span>Kliknij, aby wgrać</span> </> )}
                  </button>
                )}
              </CldUploadWidget>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Background Image (główne tło)</label>
                <CldUploadWidget uploadPreset="ml_default" onSuccess={handleUploadSuccess(setMainImageUrl)}>
                {({ open }) => (
                  <button type="button" onClick={() => open()} className="w-full h-48 border-2 border-dashed border-neutral-700 rounded-lg flex flex-col items-center justify-center text-neutral-500 hover:border-accent hover:text-accent transition-colors">
                    {mainImageUrl ? <CldImage src={mainImageUrl} alt="Main Image" width={150} height={150} className="max-h-full w-auto" /> : ( <> <UploadCloud size={32} /> <span>Kliknij, aby wgrać</span> </> )}
                  </button>
                )}
              </CldUploadWidget>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Główna treść projektu</label>
            <ContentEditor content={content} onChange={setContent} />
          </div>
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-accent text-black font-bold px-8 py-3 rounded-lg hover:bg-accent-muted transition-colors disabled:bg-neutral-600 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Zapisywanie..." : "Zapisz zmiany"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
