"use client";

import { Button } from "@/app/_components/mtw-wrappers";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function ViewMoreComments({ commentCount }: { commentCount: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleClick = () => {
    const newViewAmount = (
      parseInt(searchParams.get("viewAmount") ?? "10") + 10
    ).toString();
    const params = new URLSearchParams(searchParams);
    params.set("viewAmount", newViewAmount);
    router.push(pathname + "?" + params.toString());
  };

  if (commentCount <= parseInt(searchParams.get("viewAmount") ?? "10"))
    return null;

  return (
    <Button onClick={handleClick} color="indigo" variant="outlined">
      View more
    </Button>
  );
}
