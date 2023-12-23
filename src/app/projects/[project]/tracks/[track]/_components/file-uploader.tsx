import { MenuItem } from "@/app/_components/mtw-wrappers";
import { useUploadThing } from "@/utils/uploadthing";
import { type FileType } from "@prisma/client";
import { type FileWithPath } from "@uploadthing/react";
import { useDropzone } from "@uploadthing/react/hooks";
import { useCallback } from "react";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { useFileUploadProgress } from "../_providers/file-upload-progress-provider";
import { useSnackBar } from "@/app/_providers/snackbar-provider";
import { useRouter } from "next/navigation";
import { fileTypeData } from "@/utils/misc-utils";

type AudioUploaderProps = {
  fileType: FileType;
  trackId: string;
};
export function FileUploader({ fileType, trackId }: AudioUploaderProps) {
  const { addFile, removeFile } = useFileUploadProgress();
  const typeData = fileTypeData[fileType];
  const { showErrorNotification } = useSnackBar();
  const router = useRouter();

  const { startUpload, permittedFileInfo } = useUploadThing(
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

  const onDrop = useCallback(async (acceptedFiles: FileWithPath[]) => {
    await startUpload(acceptedFiles, {
      trackId,
      type: fileType,
    });
  }, []);

  const fileTypes = permittedFileInfo?.config
    ? Object.keys(permittedFileInfo?.config)
    : [];

  const { getRootProps, getInputProps } = useDropzone({
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
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
