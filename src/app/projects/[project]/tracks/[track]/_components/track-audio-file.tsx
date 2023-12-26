"use client";
import { IconButton, Typography } from "@/app/_components/mtw-wrappers";
import { useAudioPlayer } from "@/app/_providers/audio-player-provider";
import { fileTypeData } from "@/utils/misc-utils";
import { type FileWithMeta } from "@/utils/typing-utils/files";
import { usePathname } from "next/navigation";
import { IoPause, IoPlay } from "react-icons/io5";
import { FileMenu } from "./file-menu";
import { TrackFileCard } from "./track-file";
import Link from "next/link";

interface TrackAudioFileProps {
  file: FileWithMeta;
}
export function TrackAudioFile({ file }: TrackAudioFileProps) {
  const { togglePlay, setAudio, play, isPlaying, audio } = useAudioPlayer();
  const pathname = usePathname();

  const handleTogglePlay = () => {
    if (audio?.url !== file.url) {
      setAudio({
        name: file.name,
        url: file.url,
        redirect: `${pathname}/files/${file.urlName}`,
      });
      return play();
    }
    togglePlay();
  };

  const isSelected = audio?.url === file.url;

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <IconButton
          className="rounded-full"
          variant="gradient"
          color="indigo"
          onClick={handleTogglePlay}
          size="md"
        >
          {isPlaying && isSelected ? (
            <IoPause size="20" />
          ) : (
            <IoPlay size="20" />
          )}
        </IconButton>

        <div className="flex flex-col">
          <div>
            <Link
              className="hover:underline"
              href={`${pathname}/files/${file.urlName}`}
            >
              <Typography variant="h6">{file.name}</Typography>
            </Link>
            <span className="text-[15px] font-light">
              {fileTypeData[file.type].label} by @{file.createdBy.name}
            </span>
          </div>
        </div>
      </div>
      <FileMenu file={file} />
    </div>
  );
}
