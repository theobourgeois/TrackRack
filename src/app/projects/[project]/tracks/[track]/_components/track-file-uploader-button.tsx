"use client";
import { Button, MenuItem } from "@/app/_components/mtw-wrappers";
import { FileType } from "@prisma/client";

import { useState } from "react";
import ClickAwayListener from "react-click-away-listener";
import { FileUploader } from "./file-uploader";

export function TrackFileUploaderButton({ trackId }: { trackId: string }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleToggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <div className="relative">
      <div>
        <Button
          onClick={handleToggleDropdown}
          variant="gradient"
          color="indigo"
        >
          + Add a file
        </Button>
      </div>
      {isDropdownOpen && (
        <ClickAwayListener onClickAway={handleToggleDropdown}>
          <div className="absolute -left-[14%] z-[1000] mt-2 flex flex-col rounded-md bg-white p-2 drop-shadow-md">
            {(Object.keys(FileType) as FileType[]).map((fileType) => (
              <FileUploader
                trackId={trackId}
                fileType={fileType}
                key={fileType}
              />
            ))}
          </div>
        </ClickAwayListener>
      )}
    </div>
  );
}
