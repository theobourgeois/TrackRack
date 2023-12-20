"use client";
import { type FileWithMeta } from "@/utils/typing-utils/files";
import {
  IconButton,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@/app/_components/mtw-wrappers";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { MdDelete, MdFileDownload, MdInfo } from "react-icons/md";
import { useSnackBar } from "@/app/_providers/snackbar-provider";
import { useState } from "react";
import { DeleteFileDialog } from "./delete-file-dialog";
import { GetFileInfoDialog } from "./get-file-info-dialog";

enum FileMenuDialogs {
  DELETE_FILE = "DELETE_FILE",
  VIEW_FILE_INFO = "VIEW_FILE_INFO",
}

export function FileMenu({ file }: { file: FileWithMeta }) {
  const [dialog, setDialog] = useState<FileMenuDialogs | null>(null);
  const { showErrorNotification } = useSnackBar();

  const handleChangeDialog = (dialog: FileMenuDialogs) => () => {
    setDialog(dialog);
  };

  const handleDownloadFile = () => {
    fetch(file.url)
      .then((response) => response.blob())
      .then((blob) => {
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = file.name ?? "file";
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(link);
      })
      .catch((e) => {
        showErrorNotification("Download failed");
        console.error("Download failed:", e);
      });
  };

  const renderDialog = () => {
    const dialogProps = {
      open: dialog !== null,
      onClose: () => setDialog(null),
    };
    switch (dialog) {
      case FileMenuDialogs.DELETE_FILE:
        return <DeleteFileDialog {...dialogProps} id={file.id} />;
      case FileMenuDialogs.VIEW_FILE_INFO:
        return <GetFileInfoDialog file={file} {...dialogProps} />;
      default:
        return null;
    }
  };

  return (
    <>
      {renderDialog()}
      <Menu placement="bottom-start">
        <MenuHandler>
          <IconButton variant="text">
            <HiOutlineDotsVertical
              size="25"
              className="rotate-90 cursor-pointer"
            />
          </IconButton>
        </MenuHandler>
        <MenuList>
          <MenuItem
            icon={<MdFileDownload size="15" />}
            onClick={handleDownloadFile}
          >
            Download
          </MenuItem>
          <MenuItem
            onClick={handleChangeDialog(FileMenuDialogs.DELETE_FILE)}
            icon={<MdDelete size="15" />}
          >
            Delete
          </MenuItem>
          <MenuItem
            onClick={handleChangeDialog(FileMenuDialogs.VIEW_FILE_INFO)}
            icon={<MdInfo size="15" />}
          >
            Get info
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
}
