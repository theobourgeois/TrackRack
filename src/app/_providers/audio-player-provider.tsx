"use client";
import {
  ChangeEvent,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { IconButton, Typography } from "../_components/mtw-wrappers";
import { IoPause, IoPlay } from "react-icons/io5";
import { IoMdVolumeHigh } from "react-icons/io";
import { Slider } from "@material-tailwind/react";

type Audio = {
  name: string;
  url: string;
};

// when the value in slider is 0, the knob doesn't go to the start, but weirdly goes to the middle.
const START_TIME = 0.000000001;

/**
 * get the current time and end time of the audio in string format. e.g. 1:30 / 3:00
 * @param time
 * @param duration
 * @returns { end time, current time }
 */
const getTimeStrings = (time: number, duration: number) => {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds.toString();
    return `${minutes.toString()}:${formattedSeconds}`;
  };

  const currentTime = formatTime(time);
  const endTime = formatTime(duration);

  return { currentTime, endTime };
};

const AudioPlayerContext = createContext<{
  audio: Audio | null;
  setAudio: (audio: Audio) => void;
  play: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  togglePlay: () => void;
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
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audio, setAudio] = useState<Audio | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(100);
  const [currentTime, setCurrentTime] = useState(START_TIME);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    // reset time when audio changes
    setCurrentTime(START_TIME);

    // set duration
    if (!audioRef.current) return;
    audioRef.current.addEventListener("loadedmetadata", () => {
      setDuration(audioRef.current!.duration);
    });
    // adjust time every second
    audioRef.current.addEventListener("timeupdate", () => {
      setCurrentTime(audioRef.current!.currentTime);
    });
  }, [audio]);

  const play = () => {
    audioRef.current?.play();
    setIsPlaying(true);
  };
  const pause = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };
  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
    if (isPlaying) {
      return pause();
    }
    play();
  };

  const changeVolume = (volume: number) => {
    if (isMuted) {
      toggleMute();
    }
    if (!audioRef.current) return;
    audioRef.current.volume = volume / 100;
    setVolume(volume);
  };

  const next = () => {};
  const previous = () => {};
  const addToQueue = (audio: string) => {};

  const toggleMute = () => {
    if (!audioRef.current) return;
    setIsMuted(!isMuted);
    audioRef.current.muted = !isMuted;
  };

  /**
   * given a time in seconds, it will seek the audio to that time
   * @param time time in seconds
   */
  const seek = (time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  /**
   * function that handles the change of the current time of the audio when you drag the slider
   * @param e change event from slider
   */
  const handleChangeCurrentTime = (e: ChangeEvent<HTMLInputElement>) => {
    const timeInSeconds = (duration / 100) * Number(e.target.value);
    seek(timeInSeconds);
  };

  const timeString = getTimeStrings(currentTime, duration);

  return (
    <AudioPlayerContext.Provider
      value={{
        audio,
        setAudio,
        togglePlay,
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
      {audio && (
        <div className="fixed bottom-4 left-1/2 right-0 flex translate-x-[-50%] flex-col items-center justify-start gap-2 rounded-full bg-white p-4 drop-shadow-md md:flex-row ">
          <div className="flex items-center gap-2">
            <IconButton
              className="rounded-full"
              variant="text"
              onClick={togglePlay}
              size="md"
            >
              {isPlaying ? <IoPause size="20" /> : <IoPlay size="20" />}
            </IconButton>
            <Typography variant="h6">{audio.name}</Typography>
          </div>
          <div className="flex flex-grow items-center gap-2">
            <div className="flex flex-grow items-center gap-2">
              <Typography>{timeString.currentTime}</Typography>
              <Slider
                onChange={handleChangeCurrentTime}
                value={(currentTime / duration) * 100}
                color="indigo"
              />
              <Typography>{timeString.endTime}</Typography>
            </div>
            <div className="group relative">
              <IconButton
                onClick={toggleMute}
                variant="text"
                size="md"
                className="group relative rounded-full"
              >
                <IoMdVolumeHigh size="25" />
              </IconButton>
              <div className="absolute bottom-5 left-5 z-10 hidden origin-left -rotate-90 rounded-md bg-white p-4 drop-shadow-md group-hover:flex">
                <Slider
                  value={isMuted ? START_TIME : volume}
                  onChange={(e) => changeVolume(Number(e.target.value))}
                  color="indigo"
                />
              </div>
            </div>
          </div>

          <audio ref={audioRef} src={audio.url} autoPlay={isPlaying} />
        </div>
      )}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  return useContext(AudioPlayerContext);
}
