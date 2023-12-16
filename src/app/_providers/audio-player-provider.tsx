"use client";
import { createContext, useContext, useState } from "react";

const AudioPlayerContext = createContext<{
  audio: string | null;
  setAudio: (audio: string | null) => void;
  play: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  addToQueue: (audio: string) => void;
  isPlaying: boolean;
  volume: number;
  setVolume: (volume: number) => void;
  currentTime: number;
  duration: number;
  seek: (time: number) => void;
}>(undefined!);

export function AudioPlayerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [audio, setAudio] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(100);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const play = () => {
    setIsPlaying(true);
  };
  const pause = () => {
    setIsPlaying(false);
  };
  const next = () => {};
  const previous = () => {};
  const addToQueue = (audio: string) => {};
  const seek = (time: number) => {
    setCurrentTime(time);
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        audio,
        setAudio,
        play,
        pause,
        next,
        previous,
        addToQueue,
        isPlaying,
        volume,
        setVolume,
        currentTime,
        duration,
        seek,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  return useContext(AudioPlayerContext);
}
