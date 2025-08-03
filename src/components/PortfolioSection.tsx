"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client"; // Poprawiony import
import type { User } from "@supabase/supabase-js";

// Definiujemy typ danych, które przychodzą z Supabase
interface Project {
  id: number;
  title: string;
  tags: string;
  thumbnail_url: string;
  slug: string;
}

export default function PortfolioSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient(); // Używamy naszej nowej funkcji

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5);

        if (error) {
          throw error;
        }

        if (data) {
          setProjects(data);
        }
      } catch (err) {
        console.error("Błąd podczas pobierania danych: ", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase]);

  // Inteligentne duplikowanie projektów, aby karuzela zawsze była pełna
  const MIN_CAROUSEL_ITEMS = 6;
  let carouselProjects = [...projects];
  while (carouselProjects.length > 0 && carouselProjects.length < MIN_CAROUSEL_ITEMS) {
    carouselProjects = [...carouselProjects, ...projects];
  }

  return (
    <section id="portfolio-home" className="py-24 bg-black overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 mb-12 flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-bold font-druk-wide mb-2">
            Wybrane projekty
          </h2>
          <p className="text-neutral-400">Sprawdź moje ostatnie prace.</p>
        </div>
        <Link
          href="/portfolio"
          className="group flex-shrink-0 w-14 h-14 border border-neutral-700 rounded-full flex items-center justify-center hover:bg-accent hover:border-accent transition-colors"
        >
          <ArrowRight className="text-neutral-400 group-hover:text-black transition-colors" />
        </Link>
      </div>

      {loading ? (
        <div className="h-72 flex items-center justify-center text-neutral-500">
          Ładowanie projektów...
        </div>
      ) : projects.length > 0 ? (
        <div
          className="group w-full inline-flex flex-nowrap [mask-image:_linear_gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]"
        >
          <ul className="flex items-stretch justify-center animate-infinite-scroll group-hover:[animation-play-state:paused]">
            {[...carouselProjects, ...carouselProjects].map((project, index) => (
              <li key={`${project.id}-${index}`} className="mx-4 flex-shrink-0">
                <Link
                  href={`/portfolio/${project.slug}`}
                  className="block w-[350px] group/item"
                >
                  <div className="w-full h-64 bg-neutral-800 rounded-xl overflow-hidden mb-4">
                    <Image
                      src={project.thumbnail_url}
                      alt={project.title}
                      width={350}
                      height={256}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-105"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-white text-lg group-hover/item:text-accent transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-sm text-neutral-400">{project.tags}</p>
                    </div>
                    <div className="text-xs px-3 py-1 border border-neutral-700 rounded-full text-neutral-300 opacity-0 group-hover/item:opacity-100 transition-opacity">
                      Zobacz
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mx-auto max-w-7xl px-6 text-center py-16 border border-dashed border-neutral-800 rounded-xl">
          <h3 className="text-xl font-bold text-neutral-400">
            Brak projektów do wyświetlenia.
          </h3>
          <p className="text-neutral-500 mt-2">
            {user
              ? "Dodaj swój pierwszy projekt, klikajac 'Dodaj projekt' w podstronie Portfolio"
              : "Wkrótce pojawią się tutaj nowe prace."}
          </p>
        </div>
      )}
    </section>
  );
}
