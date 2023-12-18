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
import {
  IoMdFastforward,
  IoMdRewind,
  IoMdVolumeHigh,
  IoMdVolumeLow,
  IoMdVolumeOff,
} from "react-icons/io";
import { Slider } from "@material-tailwind/react";
import Link from "next/link";

type Audio = {
  name: string;
  url: string;
  redirect?: string;
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

/**
 * get the volume icon based on the volume and whether the audio is muted or not
 * @param volume volume in percentage
 * @param isMuted whether the audio is muted or not
 * @returns volume icon
 */
const getVolumeIcon = (volume: number, isMuted: boolean) => {
  if (isMuted || volume === 0) return <IoMdVolumeOff size="25" />;
  if (volume < 50) return <IoMdVolumeLow size="25" />;
  return <IoMdVolumeHigh size="25" />;
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
  createQueue: (audio: Audio[]) => void;
}>(undefined!);

export function AudioPlayerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioQueue, setAudioQueue] = useState<Audio[]>([]);
  const [audio, setAudio] = useState<Audio | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(100);
  const [currentTime, setCurrentTime] = useState(START_TIME);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (Boolean(audio)) return;
    // get audio from local storage
    const audioStorage = localStorage.getItem("audio");
    if (audioStorage) {
      setAudio(JSON.parse(audioStorage));
    }

    // get volume from local storage
    const volumeStorage = localStorage.getItem("volume");
    if (volumeStorage) {
      const parsedVolume = parseInt(JSON.parse(volumeStorage));
      changeVolume(parsedVolume);
    }
  }, []);

  useEffect(() => {
    // set volume in local storage. debounce it so it doesn't get called too many times
    const timeout = setTimeout(() => {
      localStorage.setItem("volume", JSON.stringify(volume));
    }, 1000);

    return () => clearTimeout(timeout);
  }, [volume]);

  useEffect(() => {
    // reset time when audio changes
    setCurrentTime(START_TIME);

    // store the audio in local storage
    if (Boolean(audio)) {
      localStorage.setItem("audio", JSON.stringify(audio));
    }

    if (!audioRef.current) return;

    const handleSeekToCurrentTime = () => {
      setCurrentTime(audioRef.current!.currentTime);
    };

    const initializeDuration = () => {
      setDuration(audioRef.current!.duration);
    };

    audioRef.current.addEventListener("loadedmetadata", initializeDuration);
    audioRef.current.addEventListener("timeupdate", handleSeekToCurrentTime);

    // handle keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      audioRef.current?.removeEventListener(
        "loadedmetadata",
        initializeDuration,
      );
      audioRef.current?.removeEventListener(
        "timeupdate",
        handleSeekToCurrentTime,
      );
      window.removeEventListener("keydown", handleKeyDown);
    };
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

  const createQueue = (audio: Audio[]) => {
    setAudioQueue([...audio]);
  };

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
        createQueue,
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
        <div className="fixed bottom-4 left-1/2 right-0 flex translate-x-[-50%] flex-col items-center justify-start gap-4 rounded-full bg-white p-4 drop-shadow-md md:flex-row">
          <div className="flex items-center gap-3">
            <IconButton
              className="rounded-full"
              variant="gradient"
              color="indigo"
              onClick={togglePlay}
              size="md"
            >
              {isPlaying ? <IoPause size="20" /> : <IoPlay size="20" />}
            </IconButton>

            <Link
              className="cursor-pointer hover:underline"
              href={audio.redirect ?? ""}
            >
              <Typography variant="h5">{audio.name}</Typography>
            </Link>
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
                {getVolumeIcon(volume, isMuted)}
              </IconButton>
              <div className="absolute bottom-5 left-5 z-10 hidden origin-left -rotate-90 rounded-md bg-white p-4 drop-shadow-md group-hover:flex">
                <Slider
                  value={isMuted ? START_TIME : volume || START_TIME}
                  onChange={(e) => changeVolume(Number(e.target.value))}
                  style={{ width: "50px" }}
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
