import { Typography } from "@/app/_components/mtw-wrappers";
import { FaLock } from "react-icons/fa";

export function PrivateProject() {
  return (
    <div>
      <div className="mt-8 flex h-full flex-col items-center justify-center gap-4">
        <Typography variant="h1">This project is private</Typography>
        <FaLock size="50" />
      </div>
    </div>
  );
}
