import Link from "next/link";
import { Typography } from "./mtw-wrappers";

export function Logo() {
  return (
    <Link href="/">
      <Typography variant="h1" color="blue-gray">
        Track<span className="text-indigo-500">Rack</span>
      </Typography>
    </Link>
  );
}
