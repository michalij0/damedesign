import type { Metadata } from "next";
import ProjectClientPage from "./ProjectClientPage";
import { createClient } from "@/utils/supabase/server"; // Poprawiony import
import { notFound } from "next/navigation";

// Definiujemy typ danych dla projektu
interface Project {
  id: number;
  title: string;
  introduction: string;
  slug: string;
  // ...inne pola
}

// --- Pobieranie projektu i sąsiadów ---
const getProjectWithNavigation = async (slug: string) => {
  const supabase = createClient(); // Używamy naszej nowej funkcji

  const { data: allProjects } = await supabase
    .from("projects")
    .select("id, title, slug")
    .order("created_at", { ascending: false });

  if (!allProjects) {
    return { currentProject: null, nextProject: null, prevProject: null };
  }

  const { data: currentProject } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!currentProject) {
    return { currentProject: null, nextProject: null, prevProject: null };
  }

  const currentIndex = allProjects.findIndex((p) => p.id === currentProject.id);

  const nextProject = currentIndex > -1 && currentIndex < allProjects.length - 1
    ? allProjects[currentIndex + 1]
    : null;

  const prevProject = currentIndex > 0
    ? allProjects[currentIndex - 1]
    : null;

  return { currentProject, nextProject, prevProject };
};

// --- SEO / Metadata ---
export async function generateMetadata(props: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = props.params;
  const { currentProject } = await getProjectWithNavigation(slug);

  if (!currentProject) {
    return { title: "Nie znaleziono projektu" };
  }

  return {
    title: `${currentProject.title} | DameDesign Portfolio`,
    description: currentProject.introduction,
  };
}

// --- Strona ---
export default async function ProjectPage(props: { params: { slug: string } }) {
  const { slug } = props.params;
  const { currentProject, nextProject, prevProject } = await getProjectWithNavigation(slug);

  if (!currentProject) {
    notFound();
  }

  return (
    <ProjectClientPage
      project={currentProject}
      nextProject={nextProject}
      prevProject={prevProject}
    />
  );
}
