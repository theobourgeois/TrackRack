import { Typography } from "@/app/_components/mtw-wrappers";

export async function UserInfo({
  projectCount,
  username,
}: {
  projectCount: number;
  username: string;
}) {
  return (
    <div className="flex gap-6">
      <div>
        <Typography variant="h5">
          {projectCount} <span className="font-normal">projects</span>
        </Typography>
      </div>
      <div className="">
        <Typography variant="h5">
          0 <span className="font-normal">followers</span>
        </Typography>
      </div>
      <div>
        <Typography variant="h5">
          0 <span className="font-normal">following</span>
        </Typography>
      </div>
    </div>
  );
}
