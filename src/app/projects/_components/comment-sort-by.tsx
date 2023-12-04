"use client";
import {
  DropDown,
  DropDownHandler,
  DropDownContent,
} from "@/app/_components/drop-down";
import { Button } from "@/app/_components/mtw-wrappers";
import { DropDownOption } from "@/app/_components/popover-option";
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
    <DropDown placement="bottom-end">
      <DropDownHandler>
        <div>
          <Button className="flex items-center gap-2" variant="text" size="sm">
            <MdOutlineSort size="20" /> Sort by
          </Button>
        </div>
      </DropDownHandler>
      <DropDownContent>
        <DropDownOption onClick={handleSortBy("desc")}>Latest</DropDownOption>
        <DropDownOption onClick={handleSortBy("asc")}>Oldest</DropDownOption>
      </DropDownContent>
    </DropDown>
  );
}
