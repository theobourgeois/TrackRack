import { Avatar, Button, Typography } from "@/app/_components/mtw-wrappers";
import { FollowButton } from "./follow-button";
import { api } from "@/trpc/server";
import { User } from "@prisma/client";
import { Session } from "next-auth";

interface ProfileHeaderProps {
  user: User;
  session: Session | null;
  projectCount: number;
}

export async function ProfileHeader({
  user,
  session,
  projectCount,
}: ProfileHeaderProps) {
  const isFollowing = await api.users.isFollowing.query({
    userId: user?.id ?? "",
  });

  const userFollowingFollowersCount = await api.users.connectionsCount.query({
    userId: user?.id ?? "",
  });

  const isAuthUser = session?.user?.id === user?.id;

  return (
    <div className="flex flex-col justify-start gap-4">
      <div className="flex flex-col items-start gap-8 md:flex-row">
        <Avatar src={user.image ?? ""} className="h-44 w-44" />
        <div className="mt-2 flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <Typography variant="h2">{user.name}</Typography>
            <div className="flex items-center gap-2">
              {!isAuthUser && (
                <FollowButton
                  isAuthenticated={Boolean(session?.user)}
                  userId={user.id}
                  isFollowing={isFollowing}
                />
              )}
              {isAuthUser && (
                <Button size="sm" variant="outlined" color="indigo">
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
          <div className="flex gap-6">
            <div className="hover:underline">
              <Typography variant="h5">
                {projectCount} <span className="font-normal">projects</span>
              </Typography>
            </div>
            <div className="hover:underline">
              <Typography
                variant="h5"
                as="a"
                href={`/users/${user.name}/followers`}
              >
                {userFollowingFollowersCount.followers}{" "}
                <span className="font-normal">
                  {userFollowingFollowersCount.followers == 1
                    ? "follower"
                    : "followers"}
                </span>
              </Typography>
            </div>
            <div className="hover:underline">
              <Typography
                variant="h5"
                as="a"
                href={`/users/${user.name}/following`}
              >
                {userFollowingFollowersCount.following}{" "}
                <span className="font-normal">following</span>
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
