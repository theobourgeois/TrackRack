import { Typography } from "@/app/_components/mtw-wrappers";
import { TrackFileUploaderButton } from "./_components/track-file-uploader-button";
import { api } from "@/trpc/server";
import { FileUploadProgressProvider } from "./_providers/file-upload-progress-provider";
import { TrackFile } from "./_components/track-file";

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
    <main className="flex h-[calc(100vh-200px)] w-full flex-col items-center gap-2 overflow-y-auto py-8">
      <FileUploadProgressProvider>
        <Typography variant="h1">{track.name}</Typography>
        <TrackFileUploaderButton trackId={track.id} />
      </FileUploadProgressProvider>
      {track.files.length > 0 &&
        track.files.map((file) => <TrackFile file={file} />)}
    </main>
  );
}
