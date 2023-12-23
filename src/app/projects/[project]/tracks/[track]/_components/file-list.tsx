"use client";
import { Typography } from "@/app/_components/mtw-wrappers";
import { TrackFile } from "./track-file";
import _ from "lodash";
import { getDateString } from "@/utils/date-utils";
import { type FileWithMeta } from "@/utils/typing-utils/files";

type FileListProps = {
  files: FileWithMeta[];
};
export function FilesGroupedByDate({ files }: FileListProps) {
  const filesByDate = _.groupBy(files, (file) => getDateString(file.createdAt));
  const sortedDates = Object.keys(filesByDate).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime(),
  );

  if (!files.length) {
    return (
      <div>
        <Typography variant="h4">No files yet</Typography>
        <Typography variant="lead">
          Upload a file with the button above
        </Typography>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-8 rounded-lg bg-indigo-50/20 p-4">
      {sortedDates.map((date) => (
        <div className="flex flex-col gap-4" key={date}>
          <div className="flex items-center gap-2">
            <Typography variant="h4">{date}</Typography>
          </div>
          <div className="flex flex-wrap gap-2">
            {filesByDate[date]?.map((file) => (
              <TrackFile file={file} key={file.id} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
