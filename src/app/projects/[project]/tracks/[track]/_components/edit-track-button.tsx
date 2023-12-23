"use client";
import {
  IconButton,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@/app/_components/mtw-wrappers";
import { EditTrackDialog } from "@/app/projects/_components/tracks/edit-track-table";
import { type Track } from "@prisma/client";
import { useState } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { MdEdit } from "react-icons/md";

enum TrackMenuDialogs {
  EDIT_TRACK = "EDIT_TRACK",
}

export function TrackMenu({ track }: { track: Track }) {
  const [dialog, setDialog] = useState<TrackMenuDialogs | null>(null);

  const handleChangeDialog = (dialog: TrackMenuDialogs) => () => {
    setDialog(dialog);
  };

  const renderDialog = () => {
    const dialogProps = {
      open: dialog !== null,
      onClose: () => setDialog(null),
    };
    switch (dialog) {
      case TrackMenuDialogs.EDIT_TRACK:
        return <EditTrackDialog {...dialogProps} redirect track={track} />;
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
            <HiOutlineDotsVertical size="25" />
          </IconButton>
        </MenuHandler>
        <MenuList>
          <MenuItem
            onClick={handleChangeDialog(TrackMenuDialogs.EDIT_TRACK)}
            icon={<MdEdit size="15" />}
          >
            Edit track
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
}
