import { Typography } from "@/app/_components/mtw-wrappers";
import { MdOutlinePersonOff } from "react-icons/md";

export function NoUsers({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center justify-center">
        <MdOutlinePersonOff size="120" className="text-gray-400" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <Typography variant="h5" className="text-center">
          {title}
        </Typography>
      </div>
    </div>
  );
}
