"use client";
import {
  IconButton,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Typography,
} from "@/app/_components/mtw-wrappers";
import { PermissionName, type Track } from "@prisma/client";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import { ProjectDialog } from "./tracks-table-wrapper";
import { FaEdit, FaFileAlt } from "react-icons/fa";
import { getDateString } from "@/utils/date-utils";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type TrackWithMeta } from "@/utils/typing-utils/tracks";

const tableHeads = (showActions = false) => [
  { label: "#", className: "w-10" },
  { label: "Name" },
  { label: "Updated" },
  { label: "Activity" },
  ...(showActions ? [{ label: "Actions", className: "w-24" }] : []),
];

interface TracksTableProps {
  tracks: TrackWithMeta[];
  onSelect: (dialogType: ProjectDialog, track: Track) => () => void;
  userPermissions?: PermissionName[];
}

export function TracksTable({
  tracks,
  onSelect,
  userPermissions,
}: TracksTableProps) {
  const pathname = usePathname();
  return (
    <>
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
                  className="font-normal underline"
                >
                  <Link href={`${pathname}/tracks/${track.urlName}`}>
                    {track.name}
                  </Link>
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
                {Boolean(track._count.files) && (
                  <div
                    className="flex items-center gap-1"
                    title={`${track._count.files} files`}
                  >
                    <FaFileAlt size="20" />
                    <Typography variant="small" className="font-normal">
                      {track._count.files}
                    </Typography>
                  </div>
                )}
              </td>
              {userPermissions?.includes(PermissionName.AddTracks) && (
                <td className="p-4">
                  <Menu placement="bottom-start">
                    <MenuHandler>
                      <IconButton variant="text">
                        <HiOutlineDotsVertical className="rotate-90 cursor-pointer text-2xl " />
                      </IconButton>
                    </MenuHandler>
                    <MenuList>
                      <>
                        <MenuItem
                          onClick={onSelect(ProjectDialog.EDIT_TRACK, track)}
                          icon={<FaEdit />}
                        >
                          Edit
                        </MenuItem>
                        <MenuItem
                          onClick={onSelect(ProjectDialog.DELETE_TRACK, track)}
                          icon={<MdDelete size="15" />}
                        >
                          Delete
                        </MenuItem>
                      </>
                    </MenuList>
                  </Menu>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {tracks.length === 0 && (
        <div className="mt-2 flex w-full justify-center">
          <Typography className="text-center" variant="h3" color="blue-gray">
            No tracks found
          </Typography>
        </div>
      )}
    </>
  );
}
