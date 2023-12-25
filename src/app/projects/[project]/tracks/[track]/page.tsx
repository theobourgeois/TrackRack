import { TrackFileUploaderButton } from "./_components/track-file-uploader-button";
import { api } from "@/trpc/server";
import { FileUploadProgressProvider } from "./_providers/file-upload-progress-provider";
import { type FileType } from "@prisma/client";
import { FileTypeTabs } from "./_components/file-type-tabs";
import { FilesGroupedByDate } from "./_components/file-list";
import { TrackMenu } from "./_components/edit-track-button";
import { TrackHeader } from "./_components/track-header";
import { TrackNotFound } from "./_components/track-not-found";

export default async function Home({
  params,
  searchParams,
}: {
  params: { project: string; track: string };
  searchParams: { type: FileType };
}) {
  const trackData = api.tracks.get.query({
    urlName: params.track,
  });
  const projectData = api.projects.get.query({
    projectUrl: params.project,
  });

  const [track, project] = await Promise.all([trackData, projectData]);

  if (!track)
    return (
      <div className="w-full justify-center">
        <TrackNotFound />
      </div>
    );

  const files = track.files.filter((file) => {
    if (searchParams.type) {
      return file.type === searchParams.type;
    }
    return true;
  });

  return (
    <main className="h-[calc(100vh-100px)] w-full overflow-y-auto py-8">
      <div className="mx-auto flex w-3/4 flex-col gap-4">
        <FileUploadProgressProvider>
          <div className="flex flex-col gap-4">
            <TrackHeader
              projectUrl={project?.urlName ?? ""}
              track={{
                id: track.id,
                name: track.name,
              }}
            />
            <div className="flex items-center gap-2">
              <TrackMenu track={track} />
              <TrackFileUploaderButton trackId={track.id} />
            </div>
            {track.files.length > 0 && (
              <FileTypeTabs
                files={track.files}
                baseUrl={`/projects/${params.project}/tracks/${params.track}`}
                paramsType={searchParams.type}
              />
            )}
          </div>
        </FileUploadProgressProvider>
        <FilesGroupedByDate files={files} />
      </div>
    </main>
  );
}
