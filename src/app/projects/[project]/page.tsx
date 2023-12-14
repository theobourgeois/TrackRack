import { RightSidebar } from "@/app/projects/_components/projects/right-sidebar";
import { ProjectType } from "@/app/_utils/typing-utils/projects";
import { api } from "@/trpc/server";
import { TracksTableWrapper } from "../_components/tracks/tracks-table-wrapper";
import { ProjectComments } from "../_components/comments/project-comments";
import { ProjectHeader } from "../_components/projects/project-header";
import { Project } from "@prisma/client";
import { getServerAuthSession } from "@/server/auth";
import { ProjectNotFound } from "../_components/projects/project-not-found";
import { PrivateProject } from "../_components/projects/private-project";
import { Suspense } from "react";

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
  const projectComments = await api.comments.getEntityComments.query({
    id: project?.id ?? "",
    as: "project",
    viewAmount: parseInt(searchParams?.viewAmount ?? "10"),
    sortBy: searchParams?.sortBy,
  });
  const userPermissions = await api.users.getProjectUserPermissions.query({
    userId: session?.user.id ?? "",
    projectId: project?.id ?? "",
  });

  if (!project) return <ProjectNotFound />;
  if (project.isPrivate && !userPermissions?.length) return <PrivateProject />;

  return (
    <main className="flex h-screen">
      <div className="flex-grow overflow-y-auto px-12 pb-32 pt-12">
        <Suspense>
          <ProjectHeader
            isPrivate={project.isPrivate}
            id={project?.id ?? ""}
            name={project?.name ?? ""}
            description={project?.description ?? ""}
            userPermissions={userPermissions}
            type={project?.type as ProjectType}
            coverImage={project?.coverImage ?? ""}
            trackCount={project?.tracks.length ?? 0}
          />
        </Suspense>
        <Suspense>
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
        </Suspense>
        <Suspense>
          {projectComments && (
            <ProjectComments
              userPermissions={userPermissions}
              // @ts-ignore
              comments={projectComments.comments}
              commentCount={projectComments.count}
              projectId={project?.id ?? ""}
            />
          )}
        </Suspense>
      </div>
      <Suspense>
        <RightSidebar projectUrl={params.project} />
      </Suspense>
    </main>
  );
}
