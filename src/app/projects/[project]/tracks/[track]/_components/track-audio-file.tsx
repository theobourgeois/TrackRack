"use client";
import { IconButton, Typography } from "@/app/_components/mtw-wrappers";
import { useAudioPlayer } from "@/app/_providers/audio-player-provider";
import { File } from "@prisma/client";
import { usePathname } from "next/navigation";
import { IoPause, IoPlay } from "react-icons/io5";

interface TrackAudioFileProps {
  file: File;
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
    <div className="flex w-full items-center gap-2 rounded-md bg-white p-4 drop-shadow-md">
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
      <Typography variant="h6">{file.name}</Typography>
    </div>
  );
}
