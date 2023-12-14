import { api } from "@/trpc/server";
import { UserConnectionsList } from "../_components/user-connections-list";
import { UserConnectionsListTabs } from "../followers/page";
import { Suspense } from "react";
import { Spinner } from "@/app/_components/mtw-wrappers";
import { UserBadge } from "../_components/user-badge";
import { NoUsers } from "../_components/no-users";
import { getServerAuthSession } from "@/server/auth";

export default async function Home({ params }: { params: { user: string } }) {
  const user = await api.users.get.query({
    name: params.user,
  });
  const following = await api.users.following.query({
    userName: params.user,
  });
  const session = await getServerAuthSession();

  return (
    <main className="mx-auto h-[calc(100vh+400px)] w-full lg:w-4/5">
      <UserConnectionsList
        userImage={user?.image ?? ""}
        user={params.user}
        tab={UserConnectionsListTabs.Following}
      >
        <div className="flex flex-wrap items-center justify-evenly gap-10">
          <Suspense
            fallback={
              <div className="flex w-full justify-center">
                <Spinner color="indigo" />
              </div>
            }
          >
            {following.map((following) => (
              <div>
                <UserBadge
                  name={following.follower.name ?? ""}
                  image={following.follower.image ?? ""}
                  followersCount={following.follower._count.followers ?? 0}
                />
              </div>
            ))}
          </Suspense>
          <div className="flex h-full w-full items-center justify-center">
            {following.length === 0 && (
              <NoUsers
                title={
                  params.user == session?.user.name
                    ? "You aren't following anyone yet"
                    : `${params.user} isn't following anyone yet`
                }
              />
            )}
          </div>
        </div>
      </UserConnectionsList>
    </main>
  );
}
