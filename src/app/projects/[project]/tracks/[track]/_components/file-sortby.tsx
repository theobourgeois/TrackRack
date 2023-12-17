"use client";
import {
  Button,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@/app/_components/mtw-wrappers";
import { useRouter } from "next/navigation";

export enum FileSortByType {
  FileType = "File type",
  Date = "Date",
}

export function FileSortBy() {
  const router = useRouter();
  const handleChangeSortBy = (sortBy: FileSortByType) => () => {
    router.replace("?sortBy=" + sortBy);
  };

  return (
    <Menu>
      <MenuHandler>
        <Button color="indigo" variant="outlined">
          Sort by
        </Button>
      </MenuHandler>
      <MenuList className="z-[100]">
        {Object.values(FileSortByType).map((sortBy) => (
          <MenuItem onClick={handleChangeSortBy(sortBy)} key={sortBy}>
            {sortBy}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
