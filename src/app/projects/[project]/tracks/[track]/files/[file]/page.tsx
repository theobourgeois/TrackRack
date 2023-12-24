import { api } from "@/trpc/server";
import { FileHeader } from "./_components/file-header";
import { FileNotFound } from "./_components/file-not-found";
import { FileComments } from "./_components/file-comments";
import { getServerAuthSession } from "@/server/auth";
import { TrackFile } from "../../_components/track-file";

export default async function Home({
  params,
  searchParams,
}: {
  params: { project: string; track: string; file: string };
  searchParams: { viewAmount?: number; sortBy?: "asc" | "desc" };
}) {
  const file = await api.files.get.query({
    urlName: params.file,
  });
  const comments = await api.comments.getEntityComments.query({
    id: file?.id ?? "",
    as: "file",
    viewAmount: searchParams?.viewAmount,
    sortBy: searchParams?.sortBy,
  });
  const session = await getServerAuthSession();
  const userPermissions = await api.users.getProjectUserPermissions.query({
    userId: session?.user.id ?? "",
    projectUrl: params.project,
  });

  if (!file)
    return (
      <div className="w-full justify-center">
        <FileNotFound />
      </div>
    );

  return (
    <main className="h-[calc(100vh-100px)] w-full overflow-y-auto py-8">
      <div className="mx-auto w-3/4">
        <FileHeader
          file={{
            id: file.id,
            name: file.name,
          }}
          trackUrl={params.track}
          projectUrl={params.project}
        />
        <div className="my-8 flex flex-col gap-4">
          <TrackFile file={file} />
        </div>
        <FileComments
          fileId={file.id}
          commentCount={comments.comments.length}
          userPermissions={userPermissions}
          comments={comments.comments}
          session={session}
        />
      </div>
    </main>
  );
}
