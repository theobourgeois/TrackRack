"use client";
import { PermissionName, Track } from "@prisma/client";
import { TracksTable } from "./tracks-table";
import { useState } from "react";
import {
  Button,
  IconButton,
  Popover,
  PopoverContent,
  PopoverHandler,
  Tooltip,
  Typography,
} from "@/app/_components/mtw-wrappers";
import { DeleteTrackDialog } from "./delete-track-dialog";
import { EditTrackDialog } from "./edit-track-table";
import { MdOutlineSort } from "react-icons/md";
import { DropDownOption } from "@/app/_components/popover-option";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { IoPersonAdd } from "react-icons/io5";
import { CreateTrackDialog } from "./create-tracks-dialog";
import {
  DropDown,
  DropDownContent,
  DropDownHandler,
} from "@/app/_components/drop-down";

export enum TracksTableDialogs {
  EDIT = "EDIT",
  DELETE = "DELETE",
  ADD_TRACK = "ADD_TRACK",
}

type SortBy = "updatedAt" | "name";

interface TracksTableProps {
  tracks: Track[];
  projectId: string;
  userPermissions?: PermissionName[];
}

export function TracksTableWrapper({
  tracks,
  projectId,
  userPermissions,
}: TracksTableProps) {
  const [dialog, setDialog] = useState<TracksTableDialogs | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>("updatedAt");
  const filteredTracks = tracks.sort((a, b) => {
    if (sortBy === "updatedAt") {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    } else {
      return a.name.localeCompare(b.name);
    }
  });

  const handleSortBy = (sortBy: SortBy) => () => {
    setSortBy(sortBy);
  };

  const handleOpenDialog =
    (dialog: TracksTableDialogs, track?: Track) => () => {
      if (track) {
        setSelectedTrack(track);
      }
      setDialog(dialog);
    };

  const renderDialogs = () => {
    const defaultProps = {
      open: true,
      onClose: () => setDialog(null),
    };
    if (selectedTrack) {
      switch (dialog) {
        case TracksTableDialogs.DELETE:
          return <DeleteTrackDialog id={selectedTrack.id} {...defaultProps} />;
        case TracksTableDialogs.EDIT:
          return <EditTrackDialog track={selectedTrack} {...defaultProps} />;
      }
    }

    switch (dialog) {
      case TracksTableDialogs.ADD_TRACK:
        return <CreateTrackDialog {...defaultProps} projectId={projectId} />;
    }
  };

  return (
    <>
      {renderDialogs()}
      <div className="mt-4 flex flex-col gap-2">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            {userPermissions?.includes(PermissionName.AddTracks) && (
              <Button
                onClick={handleOpenDialog(TracksTableDialogs.ADD_TRACK)}
                color="indigo"
                variant="gradient"
              >
                + Add Track
              </Button>
            )}

            {userPermissions?.includes(PermissionName.InviteGuests) && (
              <Tooltip content="Invite user">
                <div>
                  <IconButton variant="text">
                    <IoPersonAdd className="cursor-pointer" size="30" />
                  </IconButton>
                </div>
              </Tooltip>
            )}

            {userPermissions?.includes(PermissionName.EditProjectInfo) && (
              <DropDown placement="bottom-start">
                <DropDownHandler>
                  <IconButton variant="text">
                    <HiOutlineDotsVertical className="rotate-90 cursor-pointer text-4xl" />
                  </IconButton>
                </DropDownHandler>
                <DropDownContent>w</DropDownContent>
              </DropDown>
            )}
          </div>
          <div className="flex items-center">
            <DropDown placement="bottom-end">
              <DropDownHandler>
                <div>
                  <Button className="flex items-center gap-2" variant="text">
                    <MdOutlineSort size="20" /> Sort by
                  </Button>
                </div>
              </DropDownHandler>
              <DropDownContent>
                <DropDownOption onClick={handleSortBy("updatedAt")}>
                  Latest
                </DropDownOption>
                <DropDownOption onClick={handleSortBy("name")}>
                  Name
                </DropDownOption>
              </DropDownContent>
            </DropDown>
          </div>
        </div>
        <TracksTable
          userPermissions={userPermissions}
          onSelect={handleOpenDialog}
          tracks={filteredTracks}
        />
      </div>
    </>
  );
}
