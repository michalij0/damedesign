import type { Metadata } from "next";
import ProjectClientPage from "./ProjectClientPage";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

// Definiujemy typ danych dla projektu
interface Project {
  id: number;
  title: string;
  introduction: string;
  slug: string;
  // ... reszta pól
}

const getProjectWithNavigation = async (slug: string) => {
  const supabase = createServerComponentClient({ cookies });

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

  const currentIndex = allProjects.findIndex(p => p.id === currentProject.id);
  
  const nextProject = currentIndex > -1 && currentIndex < allProjects.length - 1 
    ? allProjects[currentIndex + 1] 
    : null;
    
  const prevProject = currentIndex > 0
    ? allProjects[currentIndex - 1]
    : null;

  return { currentProject, nextProject, prevProject };
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { currentProject } = await getProjectWithNavigation(params.slug);

  if (!currentProject) {
    return { title: "Nie znaleziono projektu" };
  }
 
  return {
    title: `${currentProject.title} | DameDesign Portfolio`,
    description: currentProject.introduction,
  };
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const { currentProject, nextProject, prevProject } = await getProjectWithNavigation(params.slug);

  if (!currentProject) {
    notFound();
  }

  return <ProjectClientPage project={currentProject} nextProject={nextProject} prevProject={prevProject} />;
}
