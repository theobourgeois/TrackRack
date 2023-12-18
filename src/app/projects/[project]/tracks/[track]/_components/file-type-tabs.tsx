import { Button, Typography } from "@/app/_components/mtw-wrappers";
import { fileTypeData } from "@/utils/misc-utils";
import { File, FileType } from "@prisma/client";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

type FileTypeTabsProps = {
  files: File[];
  baseUrl: string;
  paramsType: FileType | "All";
};
export function FileTypeTabs({
  files,
  paramsType,
  baseUrl,
}: FileTypeTabsProps) {
  const options = ["All", ...Object.values(FileType)] as const;
  return (
    <div className="flex flex-col flex-wrap items-center  xl:flex-row">
      {options.map((type) => {
        const count = files.filter((file) => {
          if (type === "All") return true;
          return file.type === type;
        }).length;
        const isSelectedTab =
          (type === "All" && !paramsType) || type === paramsType;
        if (!count) return null;
        return (
          <Link
            href={type === "All" ? baseUrl : `${baseUrl}?type=${type}`}
            replace
          >
            <Button
              variant="text"
              color={isSelectedTab ? "indigo" : "gray"}
              size="sm"
              className={twMerge(
                "flex items-center gap-2 rounded-none text-base ",
                isSelectedTab
                  ? "border-b-4 border-indigo-400 pb-1 "
                  : "border-b-4 border-transparent pb-1 hover:border-black",
              )}
            >
              {type == "All" ? null : fileTypeData[type].icon}
              {type == "All" ? type : fileTypeData[type].tabLabel}
              {` (${count})`}
            </Button>
          </Link>
        );
      })}
    </div>
  );
}
