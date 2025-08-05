"use client";

import Image from "next/image";
import AnimatedSection from "./AnimatedSection";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { Pencil, Trash2, PlusCircle } from "lucide-react";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { useNotification } from "@/context/NotificationProvider";
import SafeImage from "./SafeImage";
import { motion } from "framer-motion";

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

  const supabase = createClient();
  const { addNotification } = useNotification();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
    
        const { data } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
        setTestimonials(data || []);
      } catch (error) {
        console.error("Błąd pobierania danych: ", error);
      } finally {
        setLoading(false);
      }
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

  const MIN_CAROUSEL_ITEMS = 4;
  let carouselTestimonials = [...testimonials];
  while (carouselTestimonials.length > 0 && carouselTestimonials.length < MIN_CAROUSEL_ITEMS) {
    carouselTestimonials = [...carouselTestimonials, ...testimonials];
  }

  if (loading) {
    return <section id="testimonials" className="py-16 sm:py-24 bg-black" />;
  }

  return (
    <>
      <section 
        id="testimonials" 
        className="relative py-16 sm:py-24 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('/img/bg_testim.png')" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto max-w-7xl px-4 sm:px-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-1">
              <div className="flex flex-col sm:flex-row lg:flex-col items-start gap-4 sm:gap-6">
                <div>
                  <p className="text-accent text-base sm:text-lg">Kilka słów</p>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-druk-wide leading-tight text-white">
                    Od klientów
                  </h2>
                </div>
                {user && (
                  <Link href="/admin/testimonials/new" className="group flex-shrink-0 inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-neutral-800 hover:bg-accent transition-colors">
                    <PlusCircle size={12} className="sm:size-16 text-neutral-400 group-hover:text-black" />
                  </Link>
                )}
              </div>
            </div>
            <div className="lg:col-span-2 h-[400px] sm:h-[500px] lg:h-[60vh] overflow-hidden">
              {testimonials.length > 0 ? (
                <div className="group w-full h-full">
                  <ul className="flex flex-col h-full animate-infinite-scroll-vertical group-hover:[animation-play-state:paused]">
                    {[...carouselTestimonials, ...carouselTestimonials].map((testimonial, index) => (
                      <li key={`${testimonial.id}-${index}`} className="flex-shrink-0 py-6 sm:py-8 group/item relative">
                        {user && (
                          <div className="absolute top-6 sm:top-8 right-0 flex items-center gap-2 opacity-0 group-hover/item:opacity-100 transition-opacity z-20">
                            <Link href={`/admin/testimonials/edit/${testimonial.id}`} className="p-0 sm:p-1 bg-neutral-800/80 rounded-full text-white hover:bg-accent hover:text-black transition-colors transform hover:scale-110">
                              <Pencil size={4} className="sm:size-12" />
                            </Link>
                            <button onClick={() => setTestimonialToDelete(testimonial)} className="p-0 sm:p-1 bg-neutral-800/80 rounded-full text-white hover:bg-red-600 transition-colors transform hover:scale-110">
                              <Trash2 size={4} className="sm:size-12" />
                            </button>
                          </div>
                        )}
                        <blockquote className="relative text-base sm:text-lg text-neutral-300 border-l-2 border-accent pl-4 sm:pl-6">
                          <footer className="mb-3 sm:mb-4 flex items-center gap-3 sm:gap-4">
                            <SafeImage
                              src={testimonial.avatar_url || '/img/avatars/default.png'}
                              alt={testimonial.name}
                              width={40}
                              height={40}
                              className="rounded-full w-10 h-10 sm:w-12 sm:h-12"
                            />
                            <cite className="text-lg sm:text-xl font-bold not-italic text-white">
                              {testimonial.name}
                            </cite>
                          </footer>
                          <p className="break-words leading-relaxed">&quot;{testimonial.text}&quot;</p>
                        </blockquote>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-center border border-dashed border-neutral-800 rounded-xl p-4 sm:p-8">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-neutral-400">Brak opinii do wyświetlenia.</h3>
                    {user && <p className="text-neutral-500 mt-2 text-sm sm:text-base">Kliknij &quot;+&quot;, aby dodać pierwszą.</p>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      <DeleteConfirmationModal
        isOpen={!!testimonialToDelete}
        onClose={() => setTestimonialToDelete(null)}
        onConfirm={handleDelete}
        projectName={testimonialToDelete?.name || ""}
      />
    </>
  );
}