import Link from "next/link";
import { Avatar, Button, Typography } from "./mtw-wrappers";

interface ProfileCardProps {
  name: string;
  avatar: string;
}

export function ProfileCard({ name, avatar }: ProfileCardProps) {
  return (
    <div className="">
      <div className="flex justify-center gap-8">
        <Avatar size="sm" src={avatar} />

        <Button size="sm" color="indigo">
          Follow
        </Button>
      </div>
      <Link href={`/users/${name}`}>
        <Typography className="hover:underline" variant="lead">
          @{name}
        </Typography>
      </Link>
    </div>
  );
}
