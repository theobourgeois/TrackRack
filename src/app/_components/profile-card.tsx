import Link from "next/link";
import { Avatar, Button, Typography } from "./mtw-wrappers";

interface ProfileCardProps {
  name: string;
  avatar: string;
}

export function ProfileCard({ name, avatar }: ProfileCardProps) {
  return (
    <div className="flex flex-col items-start gap-4">
      <div className="flex items-center gap-2">
        <Avatar size="md" src={avatar} />
        <Link href={`/users/${name}`}>
          <Typography className="hover:underline" variant="lead">
            @{name}
          </Typography>
        </Link>
      </div>
      <Button size="sm" color="indigo">
        Follow
      </Button>
    </div>
  );
}
