import { RightSidebar } from "@/app/projects/_components/projects/right-sidebar";
import { type ProjectType } from "@/utils/typing-utils/projects";
import { api } from "@/trpc/server";
import { TracksTableWrapper } from "../_components/tracks/tracks-table-wrapper";
import { ProjectComments } from "../_components/comments/project-comments";
import { ProjectHeader } from "../_components/projects/project-header";
import { type Project } from "@prisma/client";
import { getServerAuthSession } from "@/server/auth";
import { ProjectNotFound } from "../_components/projects/project-not-found";
import { PrivateProject } from "../_components/projects/private-project";

export type ProjectFields = Pick<
  Project,
  "name" | "description" | "type" | "coverImage"
>;

export default async function Home({
  params,
  searchParams,
}: {
  params: { project: string };
  searchParams: { viewAmount?: string; sortBy?: "asc" | "desc" };
}) {
  const session = await getServerAuthSession();
  const project = await api.projects.get.query({
    projectUrl: params.project,
  });
  const projectCommentsData = api.comments.getEntityComments.query({
    id: project?.id ?? "",
    as: "project",
    viewAmount: parseInt(searchParams?.viewAmount ?? "10"),
    sortBy: searchParams?.sortBy,
  });
  const userPermissionsData = api.users.getProjectUserPermissions.query({
    userId: session?.user.id ?? "",
    projectUrl: params.project ?? "",
  });

  const [projectComments, userPermissions] = await Promise.all([
    projectCommentsData,
    userPermissionsData,
  ]);

  if (!project) return <ProjectNotFound />;
  if (project.isPrivate && !userPermissions?.length) return <PrivateProject />;

  return (
    <main className="flex h-screen">
      <div className="flex-grow overflow-y-auto px-12 pb-32 pt-12">
        <ProjectHeader
          isPrivate={project.isPrivate}
          id={project.id}
          name={project.name}
          description={project.description ?? ""}
          userPermissions={userPermissions}
          type={project?.type as ProjectType}
          coverImage={project.coverImage ?? ""}
          trackCount={project.tracks.length}
        />
        {project?.tracks && (
          <TracksTableWrapper
            projectName={project.name}
            isPrivate={project.isPrivate}
            projectId={project.id}
            tracks={project.tracks}
            userPermissions={userPermissions}
            session={session}
          />
        )}
        {projectComments && (
          <ProjectComments
            session={session}
            userPermissions={userPermissions}
            comments={projectComments.comments}
            commentCount={projectComments.count}
            projectId={project.id}
          />
        )}
      </div>
      <RightSidebar projectUrl={params.project} />
    </main>
  );
}
