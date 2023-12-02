import { Typography } from "./mtw-wrappers";

export function Logo() {
  return (
    <Typography variant="h1" color="blue-gray" as="a" href="/">
      Track<span className="text-indigo-500">Rack</span>
    </Typography>
  );
}
