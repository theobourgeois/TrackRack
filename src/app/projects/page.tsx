import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import Link from "next/link";

// api.projects.create.mutate({
//   name: "test",
//   description: "This is my new project",
//   type: "album",
//   coverImage: "https://picsum.photos/200",
// });

export default async function Home() {
  const session = await getServerAuthSession();
  const projects = await api.users.userProjects.query({
    userId: session?.user.id ?? "",
  });
  return (
    <main>
      {projects.map((project) => (
        <Link href={`/projects/${project.project.urlName}`}>
          {project.project.name}
        </Link>
      ))}
    </main>
  );
}
