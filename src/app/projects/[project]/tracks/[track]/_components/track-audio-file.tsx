"use client";
import { Avatar, IconButton, Typography } from "@/app/_components/mtw-wrappers";
import { useAudioPlayer } from "@/app/_providers/audio-player-provider";
import { getDateString } from "@/utils/date-utils";
import { FileWithMeta } from "@/utils/typing-utils/files";
import { File, User } from "@prisma/client";
import { usePathname } from "next/navigation";
import { IoPause, IoPlay } from "react-icons/io5";

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
    <div className="flex w-full items-center justify-between gap-2 rounded-md border-y p-4 drop-shadow-md transition-colors ">
      <div className="flex items-center gap-2">
        <IconButton
          className="rounded-full"
          variant="text"
          onClick={handleTogglePlay}
          size="md"
        >
          {isPlaying && audio?.url === file.url ? (
            <IoPause size="20" />
          ) : (
            <IoPlay size="20" />
          )}
        </IconButton>
        <Typography variant="h6">{file.name}</Typography>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Avatar size="sm" src={file.createdBy.image ?? ""} />
          <Typography variant="h6" color="gray">
            {file.createdBy.name}
          </Typography>
        </div>
        <Typography variant="h6" color="gray">
          {getDateString(file.createdAt)}
        </Typography>
      </div>
    </div>
  );
}
