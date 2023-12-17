"use client";
import { File, FileType } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { FileGroupByType } from "./files-group-by-button";
import { Typography } from "@/app/_components/mtw-wrappers";
import pluralize from "pluralize";
import { fileTypeData } from "@/utils/misc-utils";
import { TrackFile } from "./track-file";
import _ from "lodash";
import { getDateString } from "@/utils/date-utils";

type FileListProps = {
  files: File[];
};

export function FileList({ files }: FileListProps) {
  const searchParams = useSearchParams();
  const groupBy =
    searchParams.get("groupBy") ??
    (FileGroupByType.FileType as FileGroupByType);

  const renderList = () => {
    switch (groupBy) {
      case FileGroupByType.FileType:
        return <FilesGroupedByType files={files} />;
      case FileGroupByType.Date:
        return <FilesGroupedByDate files={files} />;
      default:
        return <div>Not implemented</div>;
    }
  };

  if (!files.length)
    return (
      <div className="flex flex-col gap-4">
        <Typography variant="h2">No files</Typography>
        <Typography variant="lead">
          Upload a file using the button above
        </Typography>
      </div>
    );

  return renderList();
}

function FilesGroupedByType({ files }: FileListProps) {
  const filesByType = _.groupBy(files, (file) => file.type);

  return (
    <div className="flex flex-col gap-4">
      {(Object.keys(filesByType) as FileType[]).map((type) => (
        <div key={type} className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="scale-125">{fileTypeData[type].icon}</div>
            <Typography variant="h3">
              {pluralize(fileTypeData[type].label)}
            </Typography>
          </div>
          <div className="flex flex-wrap gap-2">
            {filesByType[type]?.map((file) => (
              <TrackFile key={file.id} file={file} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function FilesGroupedByDate({ files }: FileListProps) {
  const filesByDate = _.groupBy(files, (file) =>
    getDateString(file.createdAt, "year", "day"),
  );
  const sortedDates = Object.keys(filesByDate).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime(),
  );
  return (
    <div className="flex flex-col gap-4">
      {sortedDates.map((date) => (
        <div className="flex flex-col gap-2" key={date}>
          <div className="flex items-center gap-2">
            <Typography variant="h3">{date}</Typography>
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
