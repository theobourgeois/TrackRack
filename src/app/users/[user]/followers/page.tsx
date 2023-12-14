import { api } from "@/trpc/server";
import { UserConnectionsList } from "../_components/user-connections-list";
import { UserBadge } from "../_components/user-badge";
import { Suspense } from "react";
import { Spinner } from "@/app/_components/mtw-wrappers";
import { NoUsers } from "../_components/no-users";

export enum UserConnectionsListTabs {
  Followers = "followers",
  Following = "following",
}

export default async function Home({ params }: { params: { user: string } }) {
  const user = await api.users.get.query({
    name: params.user,
  });
  const followers = await api.users.followers.query({
    userName: params.user,
  });

  return (
    <main className="mx-auto w-full lg:w-4/5">
      <UserConnectionsList
        userImage={user?.image ?? ""}
        user={params.user}
        tab={UserConnectionsListTabs.Followers}
      >
        <div className="flex flex-wrap items-center justify-evenly gap-10">
          <Suspense
            fallback={
              <div className="flex w-full justify-center">
                <Spinner color="indigo" />
              </div>
            }
          >
            {followers.map((follower) => (
              <div>
                <UserBadge
                  name={follower.following.name ?? ""}
                  image={follower.following.image ?? ""}
                  followersCount={follower.following._count.followers ?? 0}
                />
              </div>
            ))}
          </Suspense>
          <div className="flex h-full w-full items-center justify-center">
            {followers.length === 0 && (
              <NoUsers title={`${params.user} isn't followed by anyone yet`} />
            )}
          </div>
        </div>
      </UserConnectionsList>
    </main>
  );
}
