import { IoLayersOutline } from "react-icons/io5";
import { FaRegNoteSticky, FaFileAudio } from "react-icons/fa6";
import { CgPiano } from "react-icons/cg";
import { FaRegFileImage } from "react-icons/fa";
import { FaHeadphones } from "react-icons/fa6";
import { FileType } from "@prisma/client";
import { type OurFileRouter } from "@/app/api/uploadthing/core";

function* idGenerator() {
  let id = 0;
  while (true) {
    yield ++id;
  }
}
const idGen = idGenerator();
export const getNewId = (): number => idGen.next().value as number;

type FileTypeData = {
  [key in FileType]: {
    icon: JSX.Element;
    label: string;
    tabLabel: string;
    fileRouter: keyof OurFileRouter;
  };
};
export const fileTypeData: FileTypeData = {
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
};
