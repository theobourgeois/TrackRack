import { type FileWithMeta } from "@/utils/typing-utils/files";
import { TrackFileCard } from "./track-file";

export function DAWProjectFile({ file }: { file: FileWithMeta }) {
  return <TrackFileCard>Hello world {file.name}</TrackFileCard>;
}
