import { FileType } from "@prisma/client";
import { TrackAudioFile } from "./track-audio-file";
import { FileWithMeta } from "@/utils/typing-utils/files";

export function TrackFile({ file }: { file: FileWithMeta }) {
  switch (file.type) {
    case FileType.Stem:
    case FileType.Demo:
    case FileType.Instrumental:
    case FileType.Master:
      return <TrackAudioFile file={file} />;
    // case FileType.DAWProject:
    //   return <DAWProjectFile file={file} />;
    // case FileType.Lyrics:
    //   return <LyricsFile file={file} />;
    // case FileType.Midi:
    //   return <MidiFile file={file} />;
    // case FileType.Image:
    //   return <ImageFile file={file} />;
    // case FileType.Other:
    //   return <OtherFile file={file} />;
    default:
      return null;
  }
}
