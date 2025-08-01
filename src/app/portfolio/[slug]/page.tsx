import type { Metadata } from "next";
import ProjectClientPage from "./ProjectClientPage";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

// --- Definicje typów ---
// Definiujemy typ dla dynamicznych parametrów strony.
// To kluczowa zmiana, która rozwiązuje błąd na Vercel.
type PageProps = {
  params: {
    slug: string;
  };
};

// Definiujemy typ danych dla pojedynczego projektu
interface Project {
  id: number;
  title: string;
  introduction: string;
  slug: string;
  // ... reszta pól, które mogą być w obiekcie projektu
}

// --- Funkcje serwerowe do pobierania danych ---
const getProjectWithNavigation = async (slug: string) => {
  const supabase = createServerComponentClient({ cookies });

  // Pobieranie wszystkich projektów, aby ustalić nawigację (następny/poprzedni)
  const { data: allProjects } = await supabase
    .from("projects")
    .select("id, title, slug")
    .order("created_at", { ascending: false });

  if (!allProjects) {
    return { currentProject: null, nextProject: null, prevProject: null };
  }

  // Pobieranie szczegółów bieżącego projektu na podstawie slug
  const { data: currentProject } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!currentProject) {
    return { currentProject: null, nextProject: null, prevProject: null };
  }

  // Znajdowanie indeksu bieżącego projektu w tablicy wszystkich projektów
  const currentIndex = allProjects.findIndex((p) => p.id === currentProject.id);

  // Ustalanie projektu następnego w kolejności
  const nextProject = currentIndex > -1 && currentIndex < allProjects.length - 1
    ? allProjects[currentIndex + 1]
    : null;

  // Ustalanie projektu poprzedniego w kolejności
  const prevProject = currentIndex > 0
    ? allProjects[currentIndex - 1]
    : null;

  return { currentProject, nextProject, prevProject };
};

// --- Funkcja generująca metadane (SEO) ---
// Używamy zdefiniowanego typu PageProps
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { currentProject } = await getProjectWithNavigation(params.slug);

  if (!currentProject) {
    return { title: "Nie znaleziono projektu" };
  }

  return {
    title: `${currentProject.title} | DameDesign Portfolio`,
    description: currentProject.introduction,
  };
}

// --- Główny komponent strony ---
// Używamy zdefiniowanego typu PageProps
export default async function ProjectPage({ params }: PageProps) {
  const { currentProject, nextProject, prevProject } = await getProjectWithNavigation(params.slug);

  // Jeśli projekt nie istnieje, zwróć błąd "Not Found"
  if (!currentProject) {
    notFound();
  }

  // Renderuj komponent klienta z danymi projektu
  return <ProjectClientPage project={currentProject} nextProject={nextProject} prevProject={prevProject} />;
}

