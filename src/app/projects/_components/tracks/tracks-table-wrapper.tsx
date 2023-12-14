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
import { DeleteProjectDialog } from "../projects/delete-project-dialogs";

export enum ProjectDialog {
  EDIT_TRACK = "EDIT_TRACK",
  DELETE_TRACK = "DELETE_TRACK",
  ADD_TRACK = "ADD_TRACK",
  DELETE_PROJECT = "DELETE_PROJECT",
  CHANGE_PRIVACY = "CHANGE_PRIVACY",
  INVITE_USERS = "INVITE_USERS",
}

type SortBy = "updatedAt" | "name";

interface TracksTableProps {
  tracks: Track[];
  projectId: string;
  projectName: string;
  userPermissions?: PermissionName[];
  isPrivate: boolean;
  session?: Session | null;
}

export function TracksTableWrapper({
  tracks,
  projectId,
  projectName,
  isPrivate,
  userPermissions,
  session,
}: TracksTableProps) {
  const [dialog, setDialog] = useState<ProjectDialog | null>(null);
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

  const handleOpenDialog = (dialog: ProjectDialog, track?: Track) => () => {
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
        case ProjectDialog.DELETE_TRACK:
          return <DeleteTrackDialog id={selectedTrack.id} {...defaultProps} />;
        case ProjectDialog.EDIT_TRACK:
          return <EditTrackDialog track={selectedTrack} {...defaultProps} />;
      }
    }

    switch (dialog) {
      case ProjectDialog.ADD_TRACK:
        return <CreateTrackDialog {...defaultProps} projectId={projectId} />;
      case ProjectDialog.CHANGE_PRIVACY:
        return (
          <ChangeProjectPrivacyDialog
            {...defaultProps}
            projectId={projectId}
            isPrivate={isPrivate}
          />
        );
      case ProjectDialog.INVITE_USERS:
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
      case ProjectDialog.DELETE_PROJECT:
        return (
          <DeleteProjectDialog
            {...defaultProps}
            id={projectId}
            projectName={projectName}
          />
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
                onClick={handleOpenDialog(ProjectDialog.ADD_TRACK)}
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
                    onClick={handleOpenDialog(ProjectDialog.INVITE_USERS)}
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
                  <MenuItem
                    onClick={handleOpenDialog(ProjectDialog.DELETE_PROJECT)}
                    icon={<MdDelete size="15" />}
                  >
                    Delete Project
                  </MenuItem>
                  <MenuItem
                    onClick={handleOpenDialog(ProjectDialog.CHANGE_PRIVACY)}
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
