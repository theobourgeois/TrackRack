"use client";

import { useAudioPlayer } from "../_providers/audio-player-provider";

export function AudioPlayerFooter() {
  const { audio, isPlaying, play, pause } = useAudioPlayer();

  if (!audio) return null;

  return (
    <div className="fixed bottom-0 flex items-center">
      <audio src={audio} autoPlay={isPlaying} />
    </div>
  );
}
