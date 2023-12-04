"use client";
import { Card, IconButton, Typography } from "@/app/_components/mtw-wrappers";
import { DropDownOption } from "@/app/_components/popover-option";
import { PermissionName, Track } from "@prisma/client";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import { TracksTableDialogs } from "./tracks-table-wrapper";
import { FaEdit } from "react-icons/fa";
import { getDateString } from "@/app/_utils/date-utils";
import {
  DropDown,
  DropDownContent,
  DropDownHandler,
} from "@/app/_components/drop-down";
import { twMerge } from "tailwind-merge";

const tableHeads = (showActions = false) => [
  { label: "#", className: "w-10" },
  { label: "Name" },
  { label: "Updated" },
  { label: "Activity" },
  ...(showActions ? [{ label: "Actions", className: "w-24" }] : []),
];

interface TracksTableProps {
  tracks: Track[];
  onSelect: (dialogType: TracksTableDialogs, track: Track) => () => void;
  userPermissions?: PermissionName[];
}

export function TracksTable({
  tracks,
  onSelect,
  userPermissions,
}: TracksTableProps) {
  return (
    <table className="mt-4 w-full min-w-max table-auto overflow-x-auto text-left">
      <thead>
        <tr>
          {Object.values(
            tableHeads(userPermissions?.includes(PermissionName.AddTracks)),
          ).map((head, index) => (
            <th
              key={index}
              className={twMerge(
                "border-b border-blue-gray-100 bg-indigo-50/75 p-4",
                head.className,
              )}
            >
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              >
                {head.label}
              </Typography>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="overflow-auto">
        {tracks.map((track, index) => (
          <tr key={track.id} className="even:bg-blue-gray-50/50">
            <td className="p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal"
              >
                {index + 1}
              </Typography>
            </td>
            <td className="p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal"
              >
                {track.name}
              </Typography>
            </td>
            <td className="p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal"
              >
                {getDateString(track.updatedAt)}
              </Typography>
            </td>
            <td className="p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-medium"
              >
                Activity
              </Typography>
            </td>
            {userPermissions?.includes(PermissionName.AddTracks) && (
              <td className="p-4">
                <DropDown placement="bottom-start">
                  <DropDownHandler>
                    <div>
                      <IconButton variant="text">
                        <HiOutlineDotsVertical className="rotate-90 cursor-pointer text-2xl " />
                      </IconButton>
                    </div>
                  </DropDownHandler>
                  <DropDownContent>
                    <>
                      <DropDownOption
                        onClick={onSelect(TracksTableDialogs.EDIT, track)}
                        icon={FaEdit}
                      >
                        Edit
                      </DropDownOption>
                      <DropDownOption
                        onClick={onSelect(TracksTableDialogs.DELETE, track)}
                        icon={MdDelete}
                      >
                        Delete
                      </DropDownOption>
                    </>
                  </DropDownContent>
                </DropDown>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
