"use client";
import {
  Avatar,
  IconButton,
  Tooltip,
  Typography,
} from "@/app/_components/mtw-wrappers";
import { useAudioPlayer } from "@/app/_providers/audio-player-provider";
import { fileTypeData } from "@/utils/misc-utils";
import { FileWithMeta } from "@/utils/typing-utils/files";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoPause, IoPlay } from "react-icons/io5";
import { FileMenu } from "./file-menu";
import { TrackFileCard } from "./track-file";

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
        redirect: pathname,
      });
      return play();
    }
    togglePlay();
  };

  return (
    <TrackFileCard>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <IconButton
            className="rounded-full"
            variant="gradient"
            color="indigo"
            onClick={handleTogglePlay}
            size="md"
          >
            {isPlaying && audio?.url === file.url ? (
              <IoPause size="20" />
            ) : (
              <IoPlay size="20" />
            )}
          </IconButton>

          <div className="flex flex-col">
            <div>
              <Typography variant="h5">{file.name}</Typography>
              <span>
                {fileTypeData[file.type].label} by @{file.createdBy.name}
              </span>
            </div>
          </div>
        </div>
        <FileMenu file={file} />
      </div>
    </TrackFileCard>
  );
}
