"use client";
import {
  Button,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@/app/_components/mtw-wrappers";
import { useRouter } from "next/navigation";

export enum FileGroupByType {
  FileType = "File type",
  Date = "Date",
}

export function FileGroupByButton() {
  const router = useRouter();
  const handleChangeSortBy = (groupBy: FileGroupByType) => () => {
    router.replace("?groupBy=" + groupBy);
  };

  return (
    <Menu>
      <MenuHandler>
        <Button color="indigo" variant="outlined">
          Group by
        </Button>
      </MenuHandler>
      <MenuList className="z-[100]">
        {Object.values(FileGroupByType).map((sortBy) => (
          <MenuItem onClick={handleChangeSortBy(sortBy)} key={sortBy}>
            {sortBy}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
