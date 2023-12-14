import { Avatar, Typography } from "@/app/_components/mtw-wrappers";
import Link from "next/link";

type UserBadgeProps = {
  name: string;
  image: string;
  followersCount: number;
};

export function UserBadge({ name, image, followersCount }: UserBadgeProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <Link href={`/users/${name}`}>
        <Avatar src={image} className="h-36 w-36" />
      </Link>
      <div className="flex flex-col items-center text-center">
        <Typography
          as="a"
          href={`/users/${name}`}
          variant="h5"
          className="hover:underline"
        >
          {name}
        </Typography>
        <div className="flex items-center gap-2">
          <Typography variant="small">
            {followersCount} {followersCount === 1 ? "follower" : "followers"}
          </Typography>
        </div>
      </div>
    </div>
  );
}
