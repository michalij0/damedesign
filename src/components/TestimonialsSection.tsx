"use client";

import Image from "next/image";
import AnimatedSection from "./AnimatedSection";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { Pencil, Trash2, PlusCircle } from "lucide-react";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { useNotification } from "@/context/NotificationProvider";

// Definiujemy typ danych dla opinii
interface Testimonial {
  id: number;
  name: string;
  text: string;
  avatar_url: string;
}

export default function TestimonialsSection() {
  const [user, setUser] = useState<User | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [testimonialToDelete, setTestimonialToDelete] = useState<Testimonial | null>(null);

  const supabase = createClientComponentClient();
  const { addNotification } = useNotification();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      const { data } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
      setTestimonials(data || []);
      setLoading(false);
    };
    fetchData();
  }, [supabase]);

  const handleDelete = async () => {
    if (!testimonialToDelete) return;

    const { error } = await supabase.from("testimonials").delete().eq("id", testimonialToDelete.id);

    if (error) {
      addNotification(`Błąd: ${error.message}`, "error");
    } else {
      addNotification("Opinia została usunięta.", "success");
      setTestimonials(testimonials.filter(t => t.id !== testimonialToDelete.id));
    }
    setTestimonialToDelete(null);
  };

  // Inteligentne duplikowanie opinii, aby karuzela zawsze była pełna
  const MIN_CAROUSEL_ITEMS = 4;
  let carouselTestimonials = [...testimonials];
  while (carouselTestimonials.length > 0 && carouselTestimonials.length < MIN_CAROUSEL_ITEMS) {
    carouselTestimonials = [...carouselTestimonials, ...testimonials];
  }


  if (loading) {
    return <section id="testimonials" className="py-24 bg-black" />;
  }

  return (
    <>
      <AnimatedSection>
        <section id="testimonials" className="py-24">
          <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-accent text-lg">Kilka słów</p>
                  <h2 className="text-5xl font-bold font-druk-wide leading-tight">
                    Od klientów
                  </h2>
                </div>
                {user && (
                  <Link href="/admin/testimonials/new" className="group flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full bg-neutral-800 hover:bg-accent transition-colors">
                    <PlusCircle size={20} className="text-neutral-400 group-hover:text-black" />
                  </Link>
                )}
              </div>
            </div>

            <div className="lg:col-span-2 h-[60vh] overflow-hidden">
              {testimonials.length > 0 ? (
                <div className="group w-full h-full">
                  <ul className="flex flex-col h-full animate-infinite-scroll-vertical group-hover:[animation-play-state:paused]">
                    {[...carouselTestimonials, ...carouselTestimonials].map((testimonial, index) => (
                      <li key={`${testimonial.id}-${index}`} className="flex-shrink-0 py-8 group/item relative">
                        {user && (
                          <div className="absolute top-8 right-0 flex items-center gap-2 opacity-0 group-hover/item:opacity-100 transition-opacity z-20">
                            <Link href={`/admin/testimonials/edit/${testimonial.id}`} className="p-2 bg-neutral-800/80 rounded-full text-white hover:bg-accent hover:text-black transition-colors transform hover:scale-110">
                              <Pencil size={14} />
                            </Link>
                            <button onClick={() => setTestimonialToDelete(testimonial)} className="p-2 bg-neutral-800/80 rounded-full text-white hover:bg-red-600 transition-colors transform hover:scale-110">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
                        <blockquote className="relative text-lg text-neutral-300 border-l-2 border-accent pl-6">
                          <footer className="mb-4 flex items-center gap-4">
                            <Image
                              src={testimonial.avatar_url || '/img/avatars/default.png'}
                              alt={testimonial.name}
                              width={48}
                              height={48}
                              className="rounded-full"
                            />
                            <cite className="text-xl font-bold not-italic text-white">
                              {testimonial.name}
                            </cite>
                          </footer>
                          <p>"{testimonial.text}"</p>
                        </blockquote>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-center border border-dashed border-neutral-800 rounded-xl">
                  <div>
                    <h3 className="text-xl font-bold text-neutral-400">Brak opinii do wyświetlenia.</h3>
                    {user && <p className="text-neutral-500 mt-2">Kliknij "+", aby dodać pierwszą.</p>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </AnimatedSection>
      <DeleteConfirmationModal
        isOpen={!!testimonialToDelete}
        onClose={() => setTestimonialToDelete(null)}
        onConfirm={handleDelete}
        projectName={testimonialToDelete?.name || ""}
      />
    </>
  );
}
