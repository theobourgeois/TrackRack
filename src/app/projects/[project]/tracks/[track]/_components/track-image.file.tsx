"use client";
import { type FileWithMeta } from "@/utils/typing-utils/files";
import { TrackFileCard } from "./track-file";
import { Dialog, DialogBody, Typography } from "@/app/_components/mtw-wrappers";
import { fileTypeData } from "@/utils/misc-utils";
import { FileMenu } from "./file-menu";
import { useState } from "react";
import Image from "next/image";

interface TrackFileImageProps {
  file: FileWithMeta;
}

export function TrackFileImage({ file }: TrackFileImageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const handleToggleOpen = () => setIsOpen((prev) => !prev);
  return (
    <>
      <Dialog
        className="flex items-center justify-center bg-opacity-0 shadow-none"
        handler={handleToggleOpen}
        open={isOpen}
      >
        <DialogBody>
          <Image
            className="h-[90vh] w-screen object-contain"
            width={1000}
            height={1000}
            src={file.url}
            alt={file.name}
          ></Image>
        </DialogBody>
      </Dialog>
      <TrackFileCard>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col">
              <div>
                <Typography variant="h5">{file.name}</Typography>
                <span>
                  {fileTypeData[file.type].label} by @{file.createdBy.name}
                </span>
              </div>
            </div>
            <FileMenu file={file} />
          </div>
          <Image
            onClick={handleToggleOpen}
            className="h-auto w-1/4 rounded-sm"
            width={1000}
            height={1000}
            alt={file.name}
            src={file.url}
          ></Image>
        </div>
      </TrackFileCard>
    </>
  );
}
