"use client";
import { File } from "@prisma/client";
import { Tooltip, Typography } from "@/app/_components/mtw-wrappers";
import { TrackFile } from "./track-file";
import _ from "lodash";
import { getDateString } from "@/utils/date-utils";
import { FileWithMeta } from "@/utils/typing-utils/files";

type FileListProps = {
  files: FileWithMeta[];
};
export function FilesGroupedByDate({ files }: FileListProps) {
  const filesByDate = _.groupBy(files, (file) => getDateString(file.createdAt));
  const sortedDates = Object.keys(filesByDate).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime(),
  );

  return (
    <div className="flex flex-col gap-8">
      {sortedDates.map((date) => (
        <div className="flex flex-col gap-4" key={date}>
          <div className="flex items-center gap-2">
            <Tooltip
              content={filesByDate[date]?.[0]?.createdAt.toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                },
              )}
            >
              <Typography variant="h3">{date}</Typography>
            </Tooltip>
          </div>
          <div className="flex flex-wrap">
            {filesByDate[date]?.map((file) => (
              <TrackFile file={file} key={file.id} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
