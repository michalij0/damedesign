"use client";

import Image from "next/image";
import AnimatedSection from "./AnimatedSection";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { Pencil } from "lucide-react";
import SafeImage from "./SafeImage";
import { motion } from "framer-motion";

interface AboutData {
  heading: string;
  description: string;
  image_url: string;
}

export default function AboutSection() {
  const [user, setUser] = useState<User | null>(null);
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      const { data } = await supabase
        .from("about_section")
        .select("heading, description, image_url")
        .single();

      setAboutData(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return <section id="o-mnie" className="py-16 sm:py-24 bg-black" />;
  }

  if (!aboutData) {
    return (
      <section id="o-mnie" className="py-16 sm:py-24 bg-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <h3 className="text-lg sm:text-xl font-bold text-neutral-400">
            Sekcja &quot;O mnie&quot; jest pusta.
          </h3>
          {user && (
            <p className="text-sm sm:text-base text-neutral-500 mt-2">
              Uzupełnij treść w panelu administratora.
            </p>
          )}
        </div>
      </section>
    );
  }

  return (
    <section
      id="o-mnie"
      className="py-16 sm:py-24 relative bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url('/img/bg_about.png')` }}
    >
      <div className="absolute inset-0 bg-black/80" />
      
      {/* Animacja zawartości */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">

          <div className="relative w-full aspect-[3/4] sm:aspect-[4/5] rounded-2xl overflow-hidden shadow-lg">
            <SafeImage
              src={aboutData.image_url || "/img/hero.png"}
              alt="Zdjęcie autora strony"
              fill
              sizes="(max-width: 768px) 90vw, (max-width: 1024px) 50vw, 40vw"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-3 sm:gap-4 mb-6">
              <h2 className="text-3xl sm:text-4xl font-bold font-mona-sans">
                {aboutData.heading}
              </h2>
              {user && (
                <Link
                  href="/admin/edit-about"
                  className="p-2 bg-neutral-800/80 backdrop-blur-sm rounded-full text-white hover:bg-accent hover:text-black transition-colors flex-shrink-0"
                >
                  <Pencil size={16} />
                </Link>
              )}
            </div>
            <div
              className="space-y-4 text-base sm:text-lg text-neutral-300"
              dangerouslySetInnerHTML={{
                __html: aboutData.description.replace(/\n/g, "<br />"),
              }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}