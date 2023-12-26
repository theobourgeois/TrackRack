import { FileType } from "@prisma/client";
import { TrackAudioFile } from "./track-audio-file";
import { type FileWithMeta } from "@/utils/typing-utils/files";
import { TrackFileImage } from "./track-image.file";
import { twMerge } from "tailwind-merge";
import { FileComments } from "./file-comments";

export function TrackFile({ file }: { file: FileWithMeta }) {
  const renderFile = () => {
    switch (file.type) {
      case FileType.Stem:
      case FileType.Demo:
      case FileType.Other:
      case FileType.Instrumental:
      case FileType.Master:
        return <TrackAudioFile file={file} />;
      case FileType.Image:
        return <TrackFileImage file={file} />;
      default:
        return null;
    }
  };

  return (
    <TrackFileCard>
      {renderFile()}
      {file._count.comments > 0 && (
        <FileComments commentsCount={file._count.comments} fileId={file.id} />
      )}
    </TrackFileCard>
  );
}

export function TrackFileCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={twMerge(
        "flex w-full flex-col gap-2 rounded-lg border bg-white bg-gradient-to-t p-3  transition-colors",
      )}
    >
      {children}
    </div>
  );
}
