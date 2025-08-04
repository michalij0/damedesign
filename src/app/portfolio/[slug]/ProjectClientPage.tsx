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
      <Link href="/portfolio" className="fixed top-1/2 left-2 sm:left-4 z-20 -translate-y-1/2">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-neutral-800/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-accent hover:text-black transition-colors"
          >
              <ArrowLeft size={16} className="sm:size-20" />
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
          <header className="relative z-10 max-w-5xl px-4 sm:px-6">
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-druk-wide leading-tight mb-4 text-accent break-words hyphens-auto">
              {project.title}
            </h1>
          </header>
        </section>

        <div className="relative bg-black">
          <div className="absolute bottom-full h-96 w-full bg-gradient-to-t from-black to-transparent" />
          <article className="pt-12 sm:pt-16 md:pt-24 pb-12 sm:pb-16 md:pb-24 font-sans">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 md:gap-8 text-neutral-300 mb-6 sm:mb-8 md:mb-12 border-y border-neutral-800 py-3 sm:py-4">
                <div>
                  <span className="text-xs sm:text-sm text-neutral-500 block">Kategoria</span>
                  <strong className="text-white font-normal text-sm sm:text-base">{project.category}</strong>
                </div>
                <div>
                  <span className="text-xs sm:text-sm text-neutral-500 block">Rok</span>
                  <strong className="text-white font-normal text-sm sm:text-base">{project.year}</strong>
                </div>
              </div>
              <div
                className="prose prose-invert prose-base sm:prose-lg md:prose-xl max-w-none prose-h2:font-druk-wide prose-h3:font-druk-wide prose-blockquote:border-accent prose-blockquote:text-neutral-200 prose-p:text-sm sm:prose-p:text-base break-words"
                dangerouslySetInnerHTML={{ __html: project.content }}
              />
            </div>
          </article>
          
          {/* Nowa, pełna sekcja nawigacji */}
          <section className="py-8 sm:py-12 md:py-16 border-t border-neutral-800">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-8 md:gap-12">
                {prevProject ? (
                  <Link href={`/portfolio/${prevProject.slug}`} className="group text-left w-full sm:w-1/2">
                      <p className="text-xs sm:text-sm text-neutral-400 mb-1">Poprzedni projekt</p>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white group-hover:text-accent transition-colors flex items-center gap-2 break-words">
                        <ArrowLeft size={16} className="sm:size-20 text-neutral-500 group-hover:text-accent transition-colors flex-shrink-0" />
                        <span className="truncate">{prevProject.title}</span>
                      </h3>
                  </Link>
                ) : (
                  <div className="w-full sm:w-1/2" />
                )}

                {nextProject && (
                  <Link href={`/portfolio/${nextProject.slug}`} className="group text-right w-full sm:w-1/2 mt-4 sm:mt-0">
                      <p className="text-xs sm:text-sm text-neutral-400 mb-1">Następny projekt</p>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white group-hover:text-accent transition-colors flex items-center justify-end gap-2 break-words">
                        <span className="truncate">{nextProject.title}</span>
                        <ArrowRight size={16} className="sm:size-20 text-neutral-500 group-hover:text-accent transition-colors flex-shrink-0" />
                      </h3>
                  </Link>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}