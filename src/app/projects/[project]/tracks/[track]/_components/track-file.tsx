import { FileType } from "@prisma/client";
import { TrackAudioFile } from "./track-audio-file";
import { type FileWithMeta } from "@/utils/typing-utils/files";
import { TrackFileImage } from "./track-image.file";
import { DAWProjectFile } from "./daw-project-file";

export function TrackFile({ file }: { file: FileWithMeta }) {
  switch (file.type) {
    case FileType.Stem:
    case FileType.Demo:
    case FileType.Other:
    case FileType.Instrumental:
    case FileType.Master:
      return <TrackAudioFile file={file} />;
    case FileType.Image:
      return <TrackFileImage file={file} />;
    case FileType.DAWProject:
      return <DAWProjectFile file={file} />;
    // case FileType.Lyrics:
    //   return <LyricsFile file={file} />;
    // case FileType.Midi:
    //   return <MidiFile file={file} />;
    default:
      return null;
  }
}

export function TrackFileCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col gap-2 rounded-lg bg-gradient-to-t from-indigo-50 to-white to-[5%] p-4 drop-shadow-md transition-colors ">
      {children}
    </div>
  );
}
