import { RightSidebar } from "@/app/projects/_components/right-sidebar";
import { ProjectType } from "@/app/_utils/typing-utils/projects";
import { api } from "@/trpc/server";
import { TracksTableWrapper } from "../_components/tracks-table-wrapper";
import { ProjectComments } from "../_components/project-comments";
import { ProjectHeader } from "../_components/project-header";
import { Project } from "@prisma/client";
import { getServerAuthSession } from "@/server/auth";

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

  return (
    <main className="flex h-screen">
      <div className="flex-grow overflow-y-auto px-12 pb-32 pt-12">
        <ProjectHeader
          id={project?.id ?? ""}
          name={project?.name ?? ""}
          description={project?.description ?? ""}
          userPermissions={userPermissions}
          type={project?.type as ProjectType}
          coverImage={project?.coverImage ?? ""}
          trackCount={project?.tracks.length ?? 0}
        />
        {project?.tracks && (
          <TracksTableWrapper
            projectId={project.id}
            tracks={project.tracks}
            userPermissions={userPermissions}
          />
        )}

        {projectComments && (
          <ProjectComments
            userPermissions={userPermissions}
            comments={projectComments.comments}
            commentCount={projectComments.count}
            projectId={project?.id ?? ""}
          />
        )}
      </div>
      <RightSidebar projectUrl={params.project} />
    </main>
  );
}
