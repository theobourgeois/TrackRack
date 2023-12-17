import { Typography } from "@/app/_components/mtw-wrappers";
import { TrackFileUploaderButton } from "./_components/track-file-uploader-button";
import { api } from "@/trpc/server";
import { FileUploadProgressProvider } from "./_providers/file-upload-progress-provider";
import { TrackFile } from "./_components/track-file";
import _ from "lodash";
import pluralize from "pluralize";
import { fileTypeData } from "@/utils/misc-utils";
import { FileType } from "@prisma/client";
import Link from "next/link";
import { FileSortBy } from "./_components/file-sortby";
import { FileList } from "./_components/file-list";

export default async function Home({
  params,
}: {
  params: { project: string; track: string };
}) {
  const track = await api.tracks.get.query({
    urlName: params.track,
  });

  if (!track) return <div>Track not found</div>;

  return (
    <main className="h-[calc(100vh-200px)] w-full overflow-y-auto py-8">
      <div className="mx-auto flex w-3/4 flex-col gap-4">
        <FileUploadProgressProvider>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Link href={`/projects/${params.project}`}>
                <Typography className="hover:underline" variant="lead">
                  {params.project}
                </Typography>
              </Link>
              /<Typography variant="h2">{track.name}</Typography>
            </div>
            <div className="flex items-center gap-2">
              <TrackFileUploaderButton trackId={track.id} />
              <FileSortBy />
            </div>
          </div>
        </FileUploadProgressProvider>
        <FileList files={track.files} />
      </div>
    </main>
  );
}
