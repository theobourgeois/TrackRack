import { Avatar, Button, Typography } from "@/app/_components/mtw-wrappers";
import { UserConnectionsListTabs } from "../followers/page";
import { twMerge } from "tailwind-merge";
import Link from "next/link";

type UserConnectionsListProps = {
  children: React.ReactNode;
  tab: UserConnectionsListTabs;
  user: string;
  userImage: string;
};

const getHeaderName = (tab: UserConnectionsListTabs, user: string) => {
  switch (tab) {
    case UserConnectionsListTabs.Followers:
      return (
        <>
          <Link className="hover:underline" href={`/users/${user}`}>
            {user}'s
          </Link>{" "}
          followers
        </>
      );
    case UserConnectionsListTabs.Following:
      return (
        <>
          <Link className="hover:underline" href={`/users/${user}`}>
            {user}
          </Link>{" "}
          is following
        </>
      );
  }
};

export function UserConnectionsList({
  children,
  tab,
  user,
  userImage,
}: UserConnectionsListProps) {
  return (
    <div className="mx-12 my-12 flex flex-col">
      <div className="mb-8 flex items-center gap-6">
        <Link href={`/users/${user}`}>
          <Avatar src={userImage} size="xxl" />
        </Link>

        <Typography className="my-8 mb-4 font-normal" variant="h2">
          {getHeaderName(tab, user)}
        </Typography>
      </div>
      <div className="flex w-full items-center gap-4 border-b">
        {Object.keys(UserConnectionsListTabs).map((key) => {
          const tabName =
            UserConnectionsListTabs[
              key as keyof typeof UserConnectionsListTabs
            ];

          return (
            <Link href={`/users/${user}/${tabName}`} replace>
              <Button
                variant="text"
                color={tabName === tab ? "indigo" : "gray"}
                size="sm"
                className={twMerge(
                  "rounded-none text-base",
                  tabName === tab
                    ? "border-b-4 border-indigo-400 pb-1 "
                    : "border-b-4 border-transparent pb-1 hover:border-black",
                )}
              >
                {tabName}
              </Button>
            </Link>
          );
        })}
      </div>
      <div className="h-screen w-fit overflow-y-auto pt-8">{children}</div>
    </div>
  );
}
