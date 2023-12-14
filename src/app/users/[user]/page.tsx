import { Typography } from "@/app/_components/mtw-wrappers";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { ProfileHeader } from "./_components/profile-header";
import { NoUsers } from "./_components/no-users";
import { ProjectCard } from "./_components/project-card";

export default async function Home({ params }: { params: { user: string } }) {
  const user = await api.users.get.query({
    name: params.user,
  });

  const session = await getServerAuthSession();

  const userProjects = await api.users.userProjects.query({
    userId: user?.id ?? "",
  });

  if (!user)
    return (
      <div className="mt-12 flex w-full justify-center">
        <NoUsers title="This user doesn't exist" />
      </div>
    );

  return (
    <main className=" flex h-[calc(100vh-100px)] flex-col gap-4 overflow-y-auto px-16 py-8 ">
      <div className="mx-auto w-full lg:w-4/5">
        <ProfileHeader
          user={user}
          session={session}
          projectCount={userProjects.length}
        />
        <div className="mt-2 flex border-y py-2">
          <div className="flex flex-col gap-2">
            <Typography className="my-8 mb-4 font-normal" variant="h2">
              Projects
            </Typography>
            <div className="flex flex-wrap justify-evenly gap-4">
              {userProjects.map(
                (project) =>
                  (!project.project.isPrivate || // only show non-private projects except for if the project is the auth user's
                    user.id === session?.user.id) && (
                    <ProjectCard
                      role={project.role.name}
                      project={project.project}
                    />
                  ),
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
