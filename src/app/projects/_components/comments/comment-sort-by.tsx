"use client";
import {
  Button,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@/app/_components/mtw-wrappers";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MdOutlineSort } from "react-icons/md";

type SortBy = "asc" | "desc";

export function CommentSortBy() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleSortBy = (sortBy: SortBy) => () => {
    const params = new URLSearchParams(searchParams);
    if (params.get("sortBy") === sortBy) return;
    params.set("sortBy", sortBy);
    router.push(pathname + "?" + params.toString());
  };

  return (
    <Menu placement="bottom-end">
      <MenuHandler>
        <div>
          <Button className="flex items-center gap-2" variant="text" size="sm">
            <MdOutlineSort size="20" /> Sort by
          </Button>
        </div>
      </MenuHandler>
      <MenuList>
        <MenuItem onClick={handleSortBy("desc")}>Latest</MenuItem>
        <MenuItem onClick={handleSortBy("asc")}>Oldest</MenuItem>
      </MenuList>
    </Menu>
  );
}
