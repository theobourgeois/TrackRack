"use client";
import { Typography } from "@/app/_components/mtw-wrappers";
import { ProjectType } from "@/app/_utils/typing-utils/projects";
import { useState } from "react";
import { MdModeEditOutline } from "react-icons/md";
import { EditProjectDialog } from "./edit-project-dialog";
import { PermissionName } from "@prisma/client";
import { twMerge } from "tailwind-merge";

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
  isPrivate: boolean;
  userPermissions?: PermissionName[];
}

export function ProjectHeader({
  name,
  type,
  coverImage,
  description,
  trackCount,
  isPrivate,
  userPermissions,
  id,
}: ProjectHeaderProps) {
  const [dialog, setDialog] = useState<ProjectHeaderDialogs | null>(null);
  const canEditProject = userPermissions?.includes(
    PermissionName.EditProjectInfo,
  );
  const handleOpenDialog = (dialog: ProjectHeaderDialogs) => () => {
    setDialog(dialog);
  };

  const renderDialog = () => {
    const defaultProps = {
      open: true,
      onClose: () => setDialog(null),
    };
    if (!canEditProject) return null;

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
              className={twMerge(
                "h-56 w-56 rounded-lg bg-indigo-500 object-cover object-center",
                canEditProject && "cursor-pointer",
              )}
            ></img>
            <div className="flex flex-col justify-end">
              <div
                onClick={handleOpenDialog(ProjectHeaderDialogs.EDIT_PROJECT)}
                className={twMerge(
                  "flex flex-col justify-end ",
                  canEditProject && "cursor-pointer",
                )}
              >
                <Typography variant="lead">
                  {isPrivate ? "Private" : "Public"} project
                </Typography>
                <Typography className="text-[60px] font-semibold">
                  {name}
                </Typography>
                <Typography className="text-lg">{description}</Typography>
                <Typography variant="h4">{`${type} - ${trackCount} tracks`}</Typography>
              </div>
            </div>
          </div>
          {canEditProject && (
            <MdModeEditOutline
              onClick={handleOpenDialog(ProjectHeaderDialogs.EDIT_PROJECT)}
              className="hidden cursor-pointer text-4xl group-hover:block"
            />
          )}
        </div>
      </div>
    </>
  );
}
