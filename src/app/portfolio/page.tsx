// src/app/portfolio/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, PlusCircle, Pencil, Trash2, X } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState, useMemo } from "react";
import type { User } from "@supabase/supabase-js";
import { useNotification } from "@/context/NotificationProvider";
import { useRouter } from "next/navigation";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import { FilterDropdown } from "@/components/FilterDropdown";
import { TagFilterDropdown } from "@/components/TagFilterDropdown";
import { motion, AnimatePresence } from "framer-motion";
import SafeImage from "@/components/SafeImage";

// UWAGA: MainLayout nie jest już importowany w tym pliku,
// ponieważ opakowanie nastąpi w pliku layout.tsx na poziomie routingu.

interface Project {
  id: number;
  created_at: string;
  title: string;
  tags: string;
  introduction: string; // Dodane pole
  thumbnail_url: string;
  slug: string;
  year: string;
}

export default function PortfolioPage() {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const [sortMode, setSortMode] = useState("newest");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const supabase = createClient();
  const { addNotification } = useNotification();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      const { data: projectsData } = await supabase.from("projects").select("*");
      setProjects(projectsData || []);
      setLoading(false);
    };
    fetchData();
  }, [supabase]);

  const handleSortChange = (value: string) => {
    setSortMode(value);
    if (value !== 'tags') {
      setSelectedTags([]);
    }
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    projects.forEach(p => {
      p.tags.split(' • ').forEach(tag => {
        if (tag) tagsSet.add(tag.trim());
      });
    });
    return Array.from(tagsSet);
  }, [projects]);

  const filteredAndSortedProjects = useMemo(() => {
    let result = [...projects];

    if (sortMode === 'tags' && selectedTags.length > 0) {
      result = result.filter(p => selectedTags.every(tag => p.tags.includes(tag)));
    }

    const currentSort = sortMode === 'tags' ? 'newest' : sortMode;
    switch (currentSort) {
      case 'newest':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'year_desc':
        result.sort((a, b) => parseInt(b.year) - parseInt(a.year));
        break;
      case 'year_asc':
        result.sort((a, b) => parseInt(a.year) - parseInt(b.year));
        break;
    }
    return result;
  }, [projects, sortMode, selectedTags]);

  const handleDelete = async () => {
    if (!projectToDelete) return;
    const { error } = await supabase.from("projects").delete().eq("id", projectToDelete.id);
    if (error) {
      addNotification(`Błąd podczas usuwania: ${error.message}`, "error");
    } else {
      addNotification(`Projekt "${projectToDelete.title}" został usunięty.`, "success");
      setProjects(projects.filter(p => p.id !== projectToDelete.id));
    }
    setProjectToDelete(null);
  };

  if (loading) {
    // UWAGA: Nie opakowujemy w MainLayout.
    return <main className="min-h-screen bg-black" />;
  }

  // UWAGA: Nie opakowujemy w MainLayout.
  return (
    <>
      <main className="pt-24 bg-black">
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="relative text-center mb-16">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-mona-sans text-accent">Portfolio</h1>
              <p className="text-base sm:text-lg text-neutral-400 mt-4 max-w-2xl mx-auto">Zbiór moich wybranych prac. Każdy projekt to nowa historia i unikalne wyzwanie.</p>
              {user && (
                <div className="absolute top-0 right-0">
                  <Link href="/portfolio/new" className="group inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-black transition-transform hover:scale-105"><PlusCircle size={16} /><span>Dodaj projekt</span></Link>
                </div>
              )}
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="md:w-64 flex-shrink-0">
                <FilterDropdown
                  value={sortMode}
                  onChange={handleSortChange}
                  options={[
                    { value: 'newest', label: 'Sortuj: Najnowsze' },
                    { value: 'oldest', label: 'Sortuj: Najstarsze' },
                    { value: 'year_desc', label: 'Sortuj: Rok malejąco' },
                    { value: 'year_asc', label: 'Sortuj: Rok rosnąco' },
                    { value: 'tags', label: 'Filtruj po tagach' },
                  ]}
                />
              </div>
              <AnimatePresence>
                {sortMode === 'tags' && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex-grow md:flex-grow-0 md:w-96 md:ml-auto"
                  >
                    <TagFilterDropdown allTags={allTags} selectedTags={selectedTags} onTagToggle={handleTagToggle} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredAndSortedProjects.map((project) => (
                  <motion.div layout key={project.id} className="group relative">
                    {/* Przyciski edycji i usuwania dla zalogowanych użytkowników */}
                    {user && (
                      <div className="absolute top-4 right-4 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Link 
                          href={`/portfolio/${project.slug}/edit`} 
                          className="p-2 bg-neutral-800/80 backdrop-blur-sm rounded-full text-white hover:bg-accent hover:text-black transition-colors"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button 
                          onClick={() => setProjectToDelete(project)} 
                          className="p-2 bg-neutral-800/80 backdrop-blur-sm rounded-full text-white hover:bg-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                    
                    <Link href={`/portfolio/${project.slug}`} className="block">
                      <div className="overflow-hidden rounded-xl mb-4 aspect-video bg-neutral-800 border-2 border-transparent group-hover:border-accent transition-colors duration-300">
                        <SafeImage src={project.thumbnail_url || "/img/placeholder.png"} alt={project.title} width={800} height={450} className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors">{project.title}</h3>
                          <p className="text-neutral-400 text-sm truncate">{project.introduction}</p>
                        </div>
                        <div className="flex items-center gap-1 text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="text-sm">Zobacz</span>
                          <ArrowRight size={16} />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
            
            {filteredAndSortedProjects.length === 0 && !loading && (
              <div className="text-center py-16 border border-dashed border-neutral-800 rounded-xl">
                <h3 className="text-xl font-bold text-neutral-400">Brak projektów spełniających kryteria.</h3>
                <p className="text-neutral-500 mt-2">Spróbuj zmienić filtry lub dodaj nowy projekt.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <DeleteConfirmationModal isOpen={!!projectToDelete} onClose={() => setProjectToDelete(null)} onConfirm={handleDelete} projectName={projectToDelete?.title || ""} />
    </>
  );
}