"use client";
import { PermissionName, Track } from "@prisma/client";
import { TracksTable } from "./tracks-table";
import { useState } from "react";
import {
  Button,
  IconButton,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Tooltip,
} from "@/app/_components/mtw-wrappers";
import { DeleteTrackDialog } from "./delete-track-dialog";
import { EditTrackDialog } from "./edit-track-table";
import { MdDelete, MdOutlineSort } from "react-icons/md";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { IoPersonAdd } from "react-icons/io5";
import { CreateTrackDialog } from "./create-tracks-dialog";
import { ChangeProjectPrivacyDialog } from "../projects/change-project-privacy-dialog";
import { FaLock, FaLockOpen } from "react-icons/fa";
import { InviteUsersDialog } from "../invite/invite-users-dialog";
import { Session } from "next-auth";

export enum TracksTableDialogs {
  EDIT = "EDIT",
  DELETE = "DELETE",
  ADD_TRACK = "ADD_TRACK",
  CHANGE_PRIVACY = "CHANGE_PRIVACY",
  INVITE_USERS = "INVITE_USERS",
}

type SortBy = "updatedAt" | "name";

interface TracksTableProps {
  tracks: Track[];
  projectId: string;
  userPermissions?: PermissionName[];
  isPrivate: boolean;
  session?: Session | null;
}

export function TracksTableWrapper({
  tracks,
  projectId,
  isPrivate,
  userPermissions,
  session,
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
      case TracksTableDialogs.CHANGE_PRIVACY:
        return (
          <ChangeProjectPrivacyDialog
            {...defaultProps}
            projectId={projectId}
            isPrivate={isPrivate}
          />
        );
      case TracksTableDialogs.INVITE_USERS:
        return (
          userPermissions &&
          session && (
            <InviteUsersDialog
              {...defaultProps}
              session={session}
              userPermissions={userPermissions}
              projectId={projectId}
            />
          )
        );
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
                  <IconButton
                    onClick={handleOpenDialog(TracksTableDialogs.INVITE_USERS)}
                    variant="text"
                  >
                    <IoPersonAdd className="cursor-pointer" size="30" />
                  </IconButton>
                </div>
              </Tooltip>
            )}

            {userPermissions?.includes(PermissionName.EditProjectInfo) && (
              <Menu placement="bottom-start">
                <MenuHandler>
                  <IconButton variant="text">
                    <HiOutlineDotsVertical className="rotate-90 cursor-pointer text-4xl" />
                  </IconButton>
                </MenuHandler>
                <MenuList>
                  <MenuItem icon={<MdDelete size="15" />}>
                    Delete Project
                  </MenuItem>
                  <MenuItem
                    onClick={handleOpenDialog(
                      TracksTableDialogs.CHANGE_PRIVACY,
                    )}
                    icon={isPrivate ? <FaLockOpen /> : <FaLock />}
                  >
                    {isPrivate ? "Make public" : "Make private"}
                  </MenuItem>
                </MenuList>
              </Menu>
            )}
          </div>
          <div className="flex items-center">
            <Menu placement="bottom-end">
              <MenuHandler>
                <div>
                  <Button className="flex items-center gap-2" variant="text">
                    <MdOutlineSort size="20" /> Sort by
                  </Button>
                </div>
              </MenuHandler>
              <MenuList>
                <MenuItem onClick={handleSortBy("updatedAt")}>Latest</MenuItem>
                <MenuItem onClick={handleSortBy("name")}>Name</MenuItem>
              </MenuList>
            </Menu>
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
