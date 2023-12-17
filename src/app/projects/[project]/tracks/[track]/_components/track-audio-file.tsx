"use client";
import { IconButton, Typography } from "@/app/_components/mtw-wrappers";
import { useAudioPlayer } from "@/app/_providers/audio-player-provider";
import { File } from "@prisma/client";
import { IoPause, IoPlay } from "react-icons/io5";

export function TrackAudioFile({ file }: { file: File }) {
  const { togglePlay, setAudio, isPlaying, audio } = useAudioPlayer();

  const handleTogglePlay = () => {
    if (audio?.url !== file.url) {
      setAudio({
        name: file.name,
        url: file.url,
      });
    }
    togglePlay();
  };

  return (
    <div className="flex w-full items-center gap-2 rounded-md bg-white p-4 drop-shadow-md">
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
      <Typography variant="paragraph">{file.name}</Typography>
    </div>
  );
}
