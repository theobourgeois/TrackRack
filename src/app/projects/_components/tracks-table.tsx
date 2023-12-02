"use client";
import { Card, IconButton, Typography } from "@/app/_components/mtw-wrappers";
import { DropDownOption } from "@/app/_components/popover-option";
import { Track } from "@prisma/client";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import { TABLE_HEAD, TracksTableDialogs } from "./tracks-table-wrapper";
import { FaEdit } from "react-icons/fa";
import { getDateString } from "@/app/_utils/date-utils";
import {
  DropDown,
  DropDownContent,
  DropDownHandler,
} from "@/app/_components/drop-down";

interface TracksTableProps {
  tracks: Track[];
  onSelect: (dialogType: TracksTableDialogs, track: Track) => () => void;
}

export function TracksTable({ tracks, onSelect }: TracksTableProps) {
  return (
    <Card className="h-full w-full">
      <table className="w-full min-w-max table-auto overflow-x-auto text-left">
        <thead className="">
          <tr className="rounded-lg">
            {TABLE_HEAD.map((head) => (
              <th
                key={head}
                className="border-b border-blue-gray-100 bg-indigo-50 p-4"
              >
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  {head}
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
                    <DropDownOption
                      onClick={onSelect(TracksTableDialogs.DELETE, track)}
                      icon={MdDelete}
                    >
                      Delete
                    </DropDownOption>
                    <DropDownOption
                      onClick={onSelect(TracksTableDialogs.EDIT, track)}
                      icon={FaEdit}
                    >
                      Edit
                    </DropDownOption>
                  </DropDownContent>
                </DropDown>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
