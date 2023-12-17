"use client";
import { File, FileType } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { FileSortByType } from "./file-sortby";
import { Typography } from "@/app/_components/mtw-wrappers";
import pluralize from "pluralize";
import { fileTypeData } from "@/utils/misc-utils";
import { TrackFile } from "./track-file";
import _ from "lodash";

type FileListProps = {
  files: File[];
};

export function FileList({ files }: FileListProps) {
  const searchParams = useSearchParams();
  const sortBy =
    searchParams.get("sortBy") ?? (FileSortByType.FileType as FileSortByType);

  const renderList = () => {
    switch (sortBy) {
      case FileSortByType.FileType:
        return <FilesGroupedByType files={files} />;
      default:
        return <div>Not implemented</div>;
    }
  };

  return renderList();
}

function FilesGroupedByType({ files }: FileListProps) {
  const filesByType = _.groupBy(files, (file) => file.type);

  return (
    <div className="flex flex-col gap-4">
      {(Object.keys(filesByType) as FileType[]).map((type) => (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="scale-125">{fileTypeData[type].icon}</div>
            <Typography variant="h2">
              {pluralize(fileTypeData[type].label)}
            </Typography>
          </div>
          <div className="flex flex-wrap gap-2">
            {filesByType[type]?.map((file) => <TrackFile file={file} />)}
          </div>
        </div>
      ))}
    </div>
  );
}
