import { api } from "@/trpc/server";
import {
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Typography,
} from "@/app/_components/mtw-wrappers";
import Image from "next/image";
import Link from "next/link";
import { HiChevronUpDown } from "react-icons/hi2";
import { twMerge } from "tailwind-merge";

type TrackHeaderProps = {
  projectUrl: string;
  track: {
    id: string;
    name: string;
  };
};

export async function TrackHeader({ projectUrl, track }: TrackHeaderProps) {
  const project = await api.projects.get.query({
    projectUrl,
  });

  return (
    <div className="flex items-center gap-2">
      <Link
        className="flex items-center gap-2"
        href={`/projects/${projectUrl}`}
      >
        <Image
          alt="Project cover image track page"
          className="rounded-sm"
          width={48}
          height={48}
          src={project?.coverImage ?? ""}
        ></Image>
        <Typography className="hover:underline" variant="lead">
          {project?.name}
        </Typography>
      </Link>
      /
      <Menu>
        <MenuHandler>
          <div className="flex cursor-pointer items-center gap-1">
            <Typography variant="h2">{track.name}</Typography>
            <HiChevronUpDown size="30" />
          </div>
        </MenuHandler>
        <MenuList>
          {project?.tracks.map(({ urlName, id, _count, name }) => (
            <Link
              key={id}
              href={`/projects/${project?.urlName}/tracks/${urlName}`}
            >
              <MenuItem
                className={twMerge(
                  id == track.id && "bg-blue-gray-50 text-black",
                )}
              >
                {`${name} (${_count.files})`}
              </MenuItem>
            </Link>
          ))}
        </MenuList>
      </Menu>
    </div>
  );
}
