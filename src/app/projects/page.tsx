import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import Link from "next/link";

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
