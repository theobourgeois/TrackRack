import { Typography } from "@/app/_components/mtw-wrappers";

export default function Loading() {
  return (
    <main className="mx-auto flex w-3/4 animate-pulse flex-col gap-8 p-12">
      <div className="flex items-center gap-2">
        <div className="h-12 w-12 rounded-md bg-gray-300"></div>
        <Typography
          as="div"
          variant="h1"
          className="h-8 w-16 rounded-full bg-gray-300"
        >
          &nbsp;
        </Typography>
        <Typography
          as="div"
          variant="h1"
          className="h-8 w-12 rounded-full bg-gray-300"
        >
          &nbsp;
        </Typography>
      </div>
      <div className="h-12 w-1/2 bg-gray-300"></div>
      <div className="h-[400px] w-full animate-pulse rounded-md bg-gray-300"></div>
    </main>
  );
}
