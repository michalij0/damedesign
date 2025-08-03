"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface ProjectData {
  title: string;
  category: string;
  year: string;
  main_image_url: string;
  introduction: string;
  content: string;
}

interface NavProjectData {
    title: string;
    slug: string;
}

export default function ProjectClientPage({ project, nextProject, prevProject }: { project: ProjectData, nextProject: NavProjectData | null, prevProject: NavProjectData | null }) {
  return (
    <>
      <Link href="/portfolio" className="fixed top-1/2 left-4 md:left-8 -translate-y-1/2 z-20">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="w-14 h-14 bg-neutral-800/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-accent hover:text-black transition-colors"
          >
              <ArrowLeft size={24} />
          </motion.div>
      </Link>

      <main>
        <section
          className="relative flex h-screen w-full flex-col items-center justify-center text-center"
          style={{
            backgroundImage: `url('${project.main_image_url}')`,
            backgroundAttachment: "fixed",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
          <header className="relative z-10 max-w-5xl px-6">
            <h1 className="text-5xl md:text-7xl font-bold font-druk-wide leading-tight mb-4 text-accent">
              {project.title}
            </h1>
          </header>
        </section>

        <div className="relative bg-black">
          <div className="absolute bottom-full h-96 w-full bg-gradient-to-t from-black to-transparent" />
          <article className="pt-24 pb-24 font-sans">
            <div className="mx-auto max-w-7xl px-6">
              <div className="flex items-center gap-8 text-neutral-300 mb-12 border-y border-neutral-800 py-4">
                <div>
                  <span className="text-sm text-neutral-500 block">Kategoria</span>
                  <strong className="text-white font-normal">{project.category}</strong>
                </div>
                <div>
                  <span className="text-sm text-neutral-500 block">Rok</span>
                  <strong className="text-white font-normal">{project.year}</strong>
                </div>
              </div>
              <div
                className="prose prose-invert prose-2xl max-w-none prose-h2:font-druk-wide prose-h3:font-druk-wide prose-blockquote:border-accent prose-blockquote:text-neutral-200"
                dangerouslySetInnerHTML={{ __html: project.content }}
              />
            </div>
          </article>
          
          {/* Nowa, pełna sekcja nawigacji */}
          <section className="py-16 border-t border-neutral-800">
            <div className="mx-auto max-w-7xl px-6 flex justify-between items-center gap-8">
              {prevProject ? (
                <Link href={`/portfolio/${prevProject.slug}`} className="group text-left min-w-0">
                    <p className="text-sm text-neutral-400">Poprzedni projekt</p>
                    <h3 className="text-3xl font-bold text-white group-hover:text-accent transition-colors flex items-center gap-2 break-words">
                      <ArrowLeft size={24} className="text-neutral-500 group-hover:text-accent transition-colors flex-shrink-0" />
                      <span>{prevProject.title}</span>
                    </h3>
                </Link>
              ) : (
                <div /> // Pusty div, aby zachować układ
              )}

              {nextProject && (
                <Link href={`/portfolio/${nextProject.slug}`} className="group text-right min-w-0">
                    <p className="text-sm text-neutral-400">Następny projekt</p>
                    <h3 className="text-3xl font-bold text-white group-hover:text-accent transition-colors flex items-center justify-end gap-2 break-words">
                      <span>{nextProject.title}</span>
                      <ArrowRight size={24} className="text-neutral-500 group-hover:text-accent transition-colors flex-shrink-0" />
                    </h3>
                </Link>
              )}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
