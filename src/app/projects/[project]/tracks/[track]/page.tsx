import {
  Menu,
  MenuHandler,
  MenuItem,
  Typography,
} from "@/app/_components/mtw-wrappers";
import { TrackFileUploaderButton } from "./_components/track-file-uploader-button";
import { api } from "@/trpc/server";
import { FileUploadProgressProvider } from "./_providers/file-upload-progress-provider";
import _ from "lodash";
import Link from "next/link";
import { FileGroupByButton } from "./_components/files-group-by-button";
import { FileList } from "./_components/file-list";
import { MenuList } from "@/app/_components/mtw-wrappers-exports";
import { IoMdArrowDropdown } from "react-icons/io";

export default async function Home({
  params,
}: {
  params: { project: string; track: string };
}) {
  const track = await api.tracks.get.query({
    urlName: params.track,
  });
  const project = await api.projects.get.query({
    projectUrl: params.project,
  });

  if (!track) return <div>Track not found</div>;

  return (
    <main className="h-[calc(100vh-200px)] w-full overflow-y-auto py-8">
      <div className="mx-auto flex w-3/4 flex-col gap-4">
        <FileUploadProgressProvider>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Link
                className="flex items-center gap-2"
                href={`/projects/${params.project}`}
              >
                <img
                  className="h-12 w-12 rounded-sm"
                  src={project?.coverImage ?? ""}
                ></img>
                <Typography className="hover:underline" variant="lead">
                  {project?.name}
                </Typography>
              </Link>
              /
              <Menu>
                <MenuHandler>
                  <div className="flex cursor-pointer items-center gap-1">
                    <Typography variant="h2">{track.name}</Typography>
                    <IoMdArrowDropdown size="30" />
                  </div>
                </MenuHandler>
                <MenuList>
                  {project?.tracks.map((track) => (
                    <Link
                      key={track.id}
                      href={`/projects/${project?.urlName}/tracks/${track.urlName}`}
                    >
                      <MenuItem>{track.name}</MenuItem>
                    </Link>
                  ))}
                </MenuList>
              </Menu>
            </div>
            <div className="flex items-center gap-2">
              <TrackFileUploaderButton trackId={track.id} />
              <FileGroupByButton />
            </div>
          </div>
        </FileUploadProgressProvider>
        <FileList files={track.files} />
      </div>
    </main>
  );
}
