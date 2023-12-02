"use client";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverHandler,
  Tooltip,
  Typography,
} from "@/app/_components/mtw-wrappers";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { IoPersonAdd } from "react-icons/io5";
import { ProjectType } from "@/app/_utils/typing-utils/projects";
import { CreateTrackDialog } from "./create-tracks-dialog";
import { useState } from "react";
import { MdModeEditOutline } from "react-icons/md";
import { EditProjectDialog } from "./edit-project-dialog";
import { Project } from "@prisma/client";
import { ReadMoreText } from "@/app/_components/readmore-text";

export enum ProjectHeaderDialogs {
  ADD_TRACK = "Add Track",
  EDIT_PROJECT = "Edit Project",
}

export type DialogComponentProps<T> = {
  open: boolean;
  onClose: () => void;
} & T;

interface ProjectHeaderProps {
  name: string;
  description: string;
  type: ProjectType;
  coverImage: string;
  trackCount: number;
  id: string;
}

export function ProjectHeader({
  name,
  type,
  coverImage,
  description,
  trackCount,
  id,
}: ProjectHeaderProps) {
  const [dialog, setDialog] = useState<ProjectHeaderDialogs | null>(null);

  const handleOpenDialog = (dialog: ProjectHeaderDialogs) => () => {
    setDialog(dialog);
  };

  const renderDialog = () => {
    const defaultProps = {
      open: true,
      onClose: () => setDialog(null),
    };
    switch (dialog) {
      case ProjectHeaderDialogs.EDIT_PROJECT:
        return (
          <EditProjectDialog
            {...defaultProps}
            project={{
              id,
              name,
              description,
              type,
              coverImage,
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {renderDialog()}
      <div className="mb-2 flex flex-col">
        <div className="group flex flex-grow items-center gap-4">
          <div className="flex flex-col gap-4 lg:flex-row">
            <img
              onClick={handleOpenDialog(ProjectHeaderDialogs.EDIT_PROJECT)}
              src={coverImage}
              className="h-64 w-64 rounded-lg bg-indigo-500 object-cover object-center"
            ></img>
            <div className="flex flex-col justify-end">
              <div
                onClick={handleOpenDialog(ProjectHeaderDialogs.EDIT_PROJECT)}
                className="flex cursor-pointer flex-col justify-end"
              >
                <Typography className="text-[70px] font-semibold">
                  {name}
                </Typography>
                <Typography variant="lead">{description}</Typography>
                <Typography variant="h4">{`${type} - ${trackCount} tracks`}</Typography>
              </div>
            </div>
          </div>
          <MdModeEditOutline className="hidden text-4xl group-hover:block" />
        </div>
      </div>
    </>
  );
}
