import {
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Typography,
} from "@/app/_components/mtw-wrappers";
import { TrackFileUploaderButton } from "./_components/track-file-uploader-button";
import { api } from "@/trpc/server";
import { FileUploadProgressProvider } from "./_providers/file-upload-progress-provider";
import Link from "next/link";
import { IoMdArrowDropdown } from "react-icons/io";
import { type FileType } from "@prisma/client";
import { FileTypeTabs } from "./_components/file-type-tabs";
import { FilesGroupedByDate } from "./_components/file-list";
import { twMerge } from "tailwind-merge";
import Image from "next/image";
import { HiChevronUpDown } from "react-icons/hi2";
import { TrackMenu } from "./_components/edit-track-button";

export default async function Home({
  params,
  searchParams,
}: {
  params: { project: string; track: string };
  searchParams: { type: FileType };
}) {
  const trackData = api.tracks.get.query({
    urlName: params.track,
  });
  const projectData = api.projects.get.query({
    projectUrl: params.project,
  });

  const [track, project] = await Promise.all([trackData, projectData]);

  if (!track) return <div>Track not found</div>;

  const files = track.files.filter((file) => {
    if (searchParams.type) {
      return file.type === searchParams.type;
    }
    return true;
  });

  return (
    <main className="h-[calc(100vh-100px)] w-full overflow-y-auto py-8">
      <div className="mx-auto flex w-3/4 flex-col gap-4">
        <FileUploadProgressProvider>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Link
                className="flex items-center gap-2"
                href={`/projects/${params.project}`}
              >
                <Image
                  alt="Project cover image"
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
            {track.description && (
              <div className="">
                <Typography variant="paragraph">{track.description}</Typography>
              </div>
            )}

            <div className="flex items-center gap-2">
              <TrackMenu track={track} />
              <TrackFileUploaderButton trackId={track.id} />
            </div>
            {track.files.length > 0 && (
              <FileTypeTabs
                files={track.files}
                baseUrl={`/projects/${params.project}/tracks/${params.track}`}
                paramsType={searchParams.type}
              />
            )}
          </div>
        </FileUploadProgressProvider>
        <FilesGroupedByDate files={files} />
      </div>
    </main>
  );
}
