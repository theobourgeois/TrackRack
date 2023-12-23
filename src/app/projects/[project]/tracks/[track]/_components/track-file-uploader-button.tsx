"use client";
import {
  Button,
  Menu,
  MenuHandler,
  MenuList,
} from "@/app/_components/mtw-wrappers";
import { FileType } from "@prisma/client";
import { FileUploader } from "./file-uploader";

export function TrackFileUploaderButton({ trackId }: { trackId: string }) {
  return (
    <Menu>
      <MenuHandler>
        <Button variant="gradient" color="indigo">
          + Add a file
        </Button>
      </MenuHandler>
      <MenuList>
        {(Object.keys(FileType) as FileType[]).map((fileType) => (
          <FileUploader trackId={trackId} fileType={fileType} key={fileType} />
        ))}
      </MenuList>
    </Menu>
  );
}
