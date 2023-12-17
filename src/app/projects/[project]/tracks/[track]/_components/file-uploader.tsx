import { MenuItem } from "@/app/_components/mtw-wrappers";
import { useUploadThing } from "@/utils/uploadthing";
import { FileType } from "@prisma/client";
import { FileWithPath } from "@uploadthing/react";
import { useDropzone } from "@uploadthing/react/hooks";
import { useState, useCallback } from "react";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { IoLayersOutline } from "react-icons/io5";
import { FaRegNoteSticky, FaFileAudio } from "react-icons/fa6";
import { CgPiano } from "react-icons/cg";
import { FaRegFileImage } from "react-icons/fa";
import { FaHeadphones } from "react-icons/fa6";
import { RiFileMusicLine } from "react-icons/ri";
import { PiMicrophoneStageBold } from "react-icons/pi";
import { SiMidi } from "react-icons/si";
import { useFileUploadProgress } from "../_providers/file-upload-progress-provider";
import { getNewId } from "@/utils/misc-utils";
import { useSnackBar } from "@/app/_providers/snackbar-provider";
import { useRouter } from "next/navigation";

const fileTypeData = {
  [FileType.Stem]: {
    icon: <IoLayersOutline size="20" />,
    label: "Stem(s)",
    fileRouter: "trackAudioUploader",
  },
  [FileType.Demo]: {
    icon: <FaRegNoteSticky size="20" />,
    label: "Demo",
    fileRouter: "trackAudioUploader",
  },
  [FileType.Instrumental]: {
    icon: <CgPiano size="20" />,
    label: "Instrumental",
    fileRouter: "trackAudioUploader",
  },
  [FileType.Other]: {
    icon: <FaFileAudio size="20" />,
    label: "Other",
    fileRouter: "trackAudioUploader",
  },
  [FileType.Image]: {
    icon: <FaRegFileImage size="20" />,
    label: "Image",
    fileRouter: "trackImageUploader",
  },
  [FileType.Master]: {
    icon: <FaHeadphones size="20" />,
    label: "Master",
    fileRouter: "trackAudioUploader",
  },
  [FileType.DAWProject]: {
    icon: <RiFileMusicLine size="20" />,
    label: "DAW Project",
    fileRouter: "trackAudioUploader",
  },
  [FileType.Lyrics]: {
    icon: <PiMicrophoneStageBold size="20" />,
    label: "Lyrics",
    fileRouter: "trackAudioUploader",
  },
  [FileType.Midi]: {
    icon: <SiMidi size="20" />,
    label: "Midi",
    fileRouter: "trackAudioUploader",
  },
} as const;

type AudioUploaderProps = {
  fileType: FileType;
  trackId: string;
};
export function FileUploader({ fileType, trackId }: AudioUploaderProps) {
  const { addFile, removeFile } = useFileUploadProgress();
  const typeData = fileTypeData[fileType];
  const { showErrorNotification } = useSnackBar();
  const router = useRouter();

  const { startUpload, permittedFileInfo, isUploading } = useUploadThing(
    typeData.fileRouter,
    {
      onClientUploadComplete: (files) => {
        files.forEach((file) => {
          removeFile(file.name);
        });
        router.refresh();
      },
      onUploadError: (error) => {
        console.error("Error uploading file:", error);
        showErrorNotification(
          error.message || "Error uploading file. Please try again.",
        );
      },
      onUploadBegin: (fileName) => {
        addFile({
          id: fileName,
          name: fileName,
        });
      },
    },
  );

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    startUpload(acceptedFiles, {
      trackId,
      type: fileType,
    });
  }, []);

  const fileTypes = permittedFileInfo?.config
    ? Object.keys(permittedFileInfo?.config)
    : [];

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
  });

  return (
    <MenuItem {...getRootProps()}>
      <input {...getInputProps()} />
      {typeData.icon}
      {typeData.label}
    </MenuItem>
  );
}
