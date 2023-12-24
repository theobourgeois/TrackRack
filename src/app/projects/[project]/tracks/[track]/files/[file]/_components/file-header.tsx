import {
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Typography,
} from "@/app/_components/mtw-wrappers";
import { api } from "@/trpc/server";
import Image from "next/image";
import Link from "next/link";
import { HiChevronUpDown } from "react-icons/hi2";
import { twMerge } from "tailwind-merge";

type FileHeaderProps = {
  projectUrl: string;
  file: {
    id: string;
    name: string;
  };
  trackUrl: string;
};

export async function FileHeader({
  projectUrl,
  file,
  trackUrl,
}: FileHeaderProps) {
  const project = await api.projects.identifiers.query({
    projectUrl,
  });
  const track = await api.tracks.get.query({
    urlName: trackUrl,
  });

  return (
    <div className="flex items-center gap-2">
      <Link
        className="flex items-center gap-2"
        href={`/projects/${projectUrl}`}
      >
        <Image
          alt="Project cover image file page"
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
      <Link
        className="flex items-center gap-2"
        href={`/projects/${projectUrl}/tracks/${trackUrl}`}
      >
        <Typography className="hover:underline" variant="h4">
          {track?.name ?? ""}
        </Typography>
      </Link>
      /
      <Menu>
        <MenuHandler>
          <div className="flex cursor-pointer items-center gap-1">
            <Typography variant="h2">{file.name}</Typography>
            <HiChevronUpDown size="30" />
          </div>
        </MenuHandler>
        <MenuList>
          {track?.files.map(({ name, urlName, id }) => (
            <Link
              key={id}
              href={`/projects/${projectUrl}/tracks/${trackUrl}/files/${urlName}`}
            >
              <MenuItem
                className={twMerge(
                  id == file.id && "bg-blue-gray-50 text-black",
                )}
              >
                {name}
              </MenuItem>
            </Link>
          ))}
        </MenuList>
      </Menu>
    </div>
  );
}
