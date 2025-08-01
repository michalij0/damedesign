import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import EditProjectForm from "@/components/EditProjectForm";

const getProjectData = async (slug: string) => {
  const supabase = createServerComponentClient({ cookies });
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .single();

  return project;
};

// Definiujemy własny typ propsów strony
type Props = {
  params: {
    slug: string;
    [key: string]: string | string[];
  };
};

export default async function EditProjectPage({ params }: Props) {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const project = await getProjectData(params.slug);

  if (!project) {
    notFound();
  }

  return <EditProjectForm project={project} />;
}
