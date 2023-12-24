import { Typography } from "@/app/_components/mtw-wrappers";
import { PiSmileySad } from "react-icons/pi";

export function TrackNotFound() {
  return (
    <div className="mt-8 flex h-full flex-col items-center justify-center gap-4">
      <Typography variant="h1">Track not found</Typography>
      <PiSmileySad size="50" />
    </div>
  );
}
