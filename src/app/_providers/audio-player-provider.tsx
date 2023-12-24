"use client";
import {
  type ChangeEvent,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { IconButton, Typography } from "../_components/mtw-wrappers";
import { IoPause, IoPlay } from "react-icons/io5";
import { IoMdVolumeHigh, IoMdVolumeLow, IoMdVolumeOff } from "react-icons/io";
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
  audioRef: React.RefObject<HTMLAudioElement>;
  changeVolume: (volume: number) => void;
  setDuration: (duration: number) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  isMuted: boolean;
  toggleMute: () => void;
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
    void audioRef.current?.play();
    setIsPlaying(true);
  };

  const pause = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const togglePlay = () => {
    setIsPlaying((isPlaying) => {
      if (isPlaying) {
        audioRef.current?.pause();
        return false;
      }
      void audioRef.current?.play();
      return true;
    });
  };

  const changeVolume = (volume: number) => {
    if (isMuted) {
      toggleMute();
    }
    if (!audioRef.current) return;
    audioRef.current.volume = volume / 100;
    setVolume(volume);
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

  return (
    <AudioPlayerContext.Provider
      value={{
        setDuration,
        changeVolume,
        audioRef,
        audio,
        setAudio,
        togglePlay,
        play,
        pause,
        isPlaying,
        volume,
        currentTime,
        duration,
        toggleMute,
        isMuted,
        seek,
      }}
    >
      {children}
      {audio && (
        <>
          <audio ref={audioRef} src={audio?.url} autoPlay={isPlaying} />
          <AudioPlayerFooter />
        </>
      )}
    </AudioPlayerContext.Provider>
  );
}

function AudioPlayerFooter() {
  const {
    togglePlay,
    audio,
    isPlaying,
    currentTime,
    duration,
    seek,
    isMuted,
    toggleMute,
    volume,
    setAudio,
    changeVolume,
  } = useAudioPlayer();

  useEffect(() => {
    if (Boolean(audio)) return;
    // get audio from local storage
    const audioStorage = localStorage.getItem("audio");
    if (audioStorage) {
      setAudio(JSON.parse(audioStorage) as Audio);
    }

    // get volume from local storage
    const volumeStorage = localStorage.getItem("volume");
    if (volumeStorage) {
      const parsedVolume = parseInt(JSON.parse(volumeStorage) as string);
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

  /**
   * function that handles the change of the current time of the audio when you drag the slider
   * @param e change event from slider
   */
  const handleChangeCurrentTime = (e: ChangeEvent<HTMLInputElement>) => {
    const timeInSeconds = (duration / 100) * Number(e.target.value);
    seek(timeInSeconds);
  };

  const timeString = getTimeStrings(currentTime, duration);

  if (!audio) return null;

  return (
    <div className="fixed bottom-4 left-1/2 right-0 flex w-[90vw] translate-x-[-50%] flex-col items-center justify-start gap-4 rounded-full border bg-white p-4 md:w-[60vw] md:flex-row">
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
          <Typography variant="h6">{audio.name}</Typography>
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
              className="w-[100px] min-w-[100px]"
              color="indigo"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function useAudioPlayer() {
  return useContext(AudioPlayerContext);
}
