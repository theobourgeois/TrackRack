import { IoLayersOutline } from "react-icons/io5";
import { FaRegNoteSticky, FaFileAudio } from "react-icons/fa6";
import { CgPiano } from "react-icons/cg";
import { FaRegFileImage } from "react-icons/fa";
import { FaHeadphones } from "react-icons/fa6";
import { RiFileMusicLine } from "react-icons/ri";
import { PiMicrophoneStageBold } from "react-icons/pi";
import { SiMidi } from "react-icons/si";
import { FileType } from "@prisma/client";

function* idGenerator() {
  let id = 0;
  while (true) {
    yield ++id;
  }
}
const idGen = idGenerator();
export const getNewId = (): number => idGen.next().value as number;

export const fileTypeData = {
  [FileType.Stem]: {
    icon: <IoLayersOutline size="20" />,
    label: "Stem",
    tabLabel: "Stems",
    fileRouter: "trackAudioUploader",
  },
  [FileType.Demo]: {
    icon: <FaRegNoteSticky size="20" />,
    tabLabel: "Demos",
    label: "Demo",
    fileRouter: "trackAudioUploader",
  },
  [FileType.Instrumental]: {
    icon: <CgPiano size="20" />,
    label: "Instrumental",
    tabLabel: "Instrumentals",
    fileRouter: "trackAudioUploader",
  },
  [FileType.Other]: {
    icon: <FaFileAudio size="20" />,
    label: "Other",
    tabLabel: "Other",
    fileRouter: "trackAudioUploader",
  },
  [FileType.Image]: {
    icon: <FaRegFileImage size="20" />,
    label: "Image",
    tabLabel: "Images",
    fileRouter: "trackImageUploader",
  },
  [FileType.Master]: {
    icon: <FaHeadphones size="20" />,
    label: "Master",
    tabLabel: "Masters",
    fileRouter: "trackAudioUploader",
  },
  [FileType.DAWProject]: {
    icon: <RiFileMusicLine size="20" />,
    label: "DAW Project",
    tabLabel: "DAW Projects",
    fileRouter: "trackAudioUploader",
  },
  [FileType.Lyrics]: {
    icon: <PiMicrophoneStageBold size="20" />,
    label: "Lyrics",
    tabLabel: "Lyrics",
    fileRouter: "trackAudioUploader",
  },
  [FileType.Midi]: {
    icon: <SiMidi size="20" />,
    label: "Midi",
    tabLabel: "Midi",
    fileRouter: "trackAudioUploader",
  },
} as const;
