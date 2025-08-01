"use client";

import Image from "next/image";
import AnimatedSection from "./AnimatedSection";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { Pencil } from "lucide-react";

interface AboutData {
  heading: string;
  description: string;
  image_url: string;
}

export default function AboutSection() {
  const [user, setUser] = useState<User | null>(null);
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      const { data } = await supabase
        .from("about_section")
        .select("heading, description, image_url")
        .single();

      setAboutData(data);
      setLoading(false);
    };
    fetchData();
  }, [supabase]);

  if (loading) {
    return <section id="o-mnie" className="py-24 bg-black" />;
  }

  if (!aboutData) {
    return (
      <section id="o-mnie" className="py-24 bg-black">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h3 className="text-xl font-bold text-neutral-400">
            Sekcja &quot;O mnie&quot; jest pusta.
          </h3>
          {user && (
            <p className="text-neutral-500 mt-2">
              Uzupełnij treść w panelu administratora.
            </p>
          )}
        </div>
      </section>
    );
  }

  return (
    <AnimatedSection>
      <section
        id="o-mnie"
        className="py-24 relative bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url('/img/bg_contact.png')` }}
      >
        <div className="absolute inset-0 bg-black/80" />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={aboutData.image_url || "/img/hero.png"}
                alt="Zdjęcie autora strony"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-4xl font-bold font-mona-sans">
                  {aboutData.heading}
                </h2>
                {user && (
                    <Link href="/admin/edit-about" className="p-2 bg-neutral-800/80 backdrop-blur-sm rounded-full text-white hover:bg-accent hover:text-black transition-colors flex-shrink-0">
                        <Pencil size={16} />
                    </Link>
                )}
              </div>
              <div
                className="space-y-4 text-lg text-neutral-300"
                dangerouslySetInnerHTML={{ __html: aboutData.description.replace(/\n/g, '<br />') }}
              />
            </div>
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}
