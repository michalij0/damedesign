import { MetadataRoute } from "next";
import { createClient } from "@/utils/supabase/server";

// Interface dla projektu
interface Project {
  slug: string;
  updated_at?: string;
  created_at?: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://damedesign.pl"; 

  try {
    // Pobieramy dane z Supabase
    const supabase = createClient();
    
    const { data: projects, error } = await supabase
      .from("projects")
      .select("slug, created_at");

    if (error) {
      console.error("Błąd pobierania projektów:", error);
      // Fallback do przykładowych danych
      return getDefaultSitemap(baseUrl);
    }

    // Dynamicznie generowane linki do projektów
    const projectUrls = (projects || []).map((project: Project) => ({
      url: `${baseUrl}/portfolio/${project.slug}`,
      lastModified: project.created_at 
        ? new Date(project.created_at)
        : new Date(),
    }));

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
      },
      {
        url: `${baseUrl}/portfolio`,
        lastModified: new Date(),
      },
      ...projectUrls,
    ];

  } catch (error) {
    console.error("Błąd w sitemap:", error);
    // Fallback do przykładowych danych
    return getDefaultSitemap(baseUrl);
  }
}

// Fallback function
function getDefaultSitemap(baseUrl: string): MetadataRoute.Sitemap {
  const projects = [
    { slug: "uzumaki-forma-ostateczna" },
    { slug: "projekty-social-media" },
    { slug: "gugu-moto-club" },
    { slug: "zimowe-warunki" },
    { slug: "inny-projekt" },
  ];

  const projectUrls = projects.map((project) => ({
    url: `${baseUrl}/portfolio/${project.slug}`,
    lastModified: new Date(),
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
    },
    ...projectUrls,
  ];
}