"use client";

import AnimatedSection from "@/components/AnimatedSection";
import LogoCarousel from "@/components/LogoCarousel";
import PortfolioSection from "@/components/PortfolioSection";
import AboutSection from "@/components/AboutSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FaqSection from "@/components/FaqSection";
import ContactSection from "@/components/ContactSection";
import Link from "next/link";
import Image from "next/image";

export default function HomePageClient() {
  return (
    <main>
      <section
        className="relative flex h-screen w-full flex-col items-center justify-center text-center"
        style={{
          backgroundImage: "url('/img/hero-background.jpg')",
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-4 inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-1 text-sm text-neutral-300">
            <span className="h-2 w-2 animate-pulse-green rounded-full bg-status-green"></span>
            <span>Jestem otwarty na współpracę</span>
          </div>
          <h1 className="font-mona-sans text-6xl font-extrabold tracking-tighter md:text-8xl lg:text-9xl">
            PROJEKTY
            <br />
            GRAFICZNE
          </h1>
          <p className="mt-4 max-w-md text-lg text-neutral-400">
            Dobrze dopasowane do Twoich potrzeb
          </p>
          <Link
            href="/portfolio"
            className="mt-8 inline-block rounded-full bg-accent px-8 py-4 font-inter text-lg font-medium text-black transition-transform hover:scale-105"
          >
            Zobacz portfolio
          </Link>
        </div>
      </section>

      <div className="relative">
        <div className="absolute bottom-full h-96 w-full bg-gradient-to-t from-black to-transparent" />
        
        {/* Sekcja Usług */}
        <div className="bg-black">
            <AnimatedSection className="mx-auto max-w-7xl px-6 pt-24">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
                <div className="flex flex-col group">
                <h3 className="font-mona-sans text-xl font-semibold text-accent">
                    Logo / Branding
                </h3>
                <p className="mt-2 text-neutral-400 mb-6">
                    Dobrze zaprojektowane logo jest najważniejszym elementem strategii wizualnej.
                </p>
                <div className="relative w-full h-80 rounded-lg overflow-hidden shadow-lg mt-auto transition-transform duration-300 ease-in-out group-hover:rotate-0 -rotate-3">
                    <Image
                    src="/img/loga.png"
                    alt="Logo i Branding"
                    fill
                    className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                </div>
                </div>
                <div className="flex flex-col group">
                <h3 className="font-mona-sans text-xl font-semibold text-accent">
                    Projekty Digital / DTP
                </h3>
                <p className="mt-2 text-neutral-400 mb-6">
                    Wyróżnij się spośród konkurencji za pomocą materiałów reklamowych online lub offline.
                </p>
                <div className="relative w-full h-80 rounded-lg overflow-hidden shadow-lg mt-auto transition-transform duration-300 ease-in-out group-hover:rotate-0 -rotate-3">
                    <Image
                    src="/img/digital.png"
                    alt="Projekty Digital i DTP"
                    fill
                    className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                </div>
                </div>
                <div className="flex flex-col group">
                <h3 className="font-mona-sans text-xl font-semibold text-accent">
                    Ilustracje
                </h3>
                <p className="mt-2 text-neutral-400 mb-6">
                    Stwórzmy razem spersonalizowaną ilustrację,
                    która odda charakter Twojej marki.
                </p>
                <div className="relative w-full h-80 rounded-lg overflow-hidden shadow-lg mt-auto transition-transform duration-300 ease-in-out group-hover:rotate-0 -rotate-3">
                    <Image
                    src="/img/mini.png"
                    alt="Ilustracje"
                    fill
                    className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                </div>
                </div>
            </div>
            </AnimatedSection>
        </div>
        
        <div className="bg-black"><LogoCarousel /></div>
        <AboutSection />
        <div className="bg-black"><PortfolioSection /></div>
        <TestimonialsSection />
        <ContactSection />
        <div className="bg-black"><FaqSection /></div>
      </div>
    </main>
  );
}
