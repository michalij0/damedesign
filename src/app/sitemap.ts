import { MetadataRoute } from "next";

// Przykładowe dane projektów - w przyszłości będziemy je pobierać z Supabase
const projects = [
  { slug: "uzumaki-forma-ostateczna" },
  { slug: "projekty-social-media" },
  { slug: "gugu-moto-club" },
  { slug: "zimowe-warunki" },
  { slug: "inny-projekt" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://damedesign.pl";

  // Dynamicznie generowane linki do projektów
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
