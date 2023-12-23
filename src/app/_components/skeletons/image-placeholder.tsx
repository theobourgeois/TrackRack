import { Typography } from "../mtw-wrappers";

export function ImagePlacehoderSkeleton() {
  return (
    <div className="flex animate-pulse flex-wrap items-center gap-8">
      <div className="grid h-56 w-56 place-items-center rounded-lg bg-gray-300"></div>
      <div className="w-max flex-grow">
        <Typography
          as="div"
          variant="h1"
          className="mb-4 h-3 w-56 rounded-full bg-gray-300"
        >
          &nbsp;
        </Typography>
        <Typography
          as="div"
          variant="paragraph"
          className="mb-2 h-4 w-72 rounded-full bg-gray-300"
        >
          &nbsp;
        </Typography>
        <Typography
          as="div"
          variant="paragraph"
          className="mb-2 h-2 w-72 rounded-full bg-gray-300"
        >
          &nbsp;
        </Typography>
        <Typography
          as="div"
          variant="paragraph"
          className="mb-2 h-3 w-72 rounded-full bg-gray-300"
        >
          &nbsp;
        </Typography>
      </div>
    </div>
  );
}
