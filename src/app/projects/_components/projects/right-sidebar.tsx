import { api } from "@/trpc/server";
import { Avatar, Typography } from "../../../_components/mtw-wrappers";
import pluralize from "pluralize";
import { type ProjectRoleName, type User } from "@prisma/client";
import Link from "next/link";

interface SidebarProfileProps {
  name: string;
  avatar: string;
}

function SidebarProfile({ name, avatar }: SidebarProfileProps) {
  return (
    <Link href={`/users/${name}`}>
      <div className="group flex cursor-pointer select-none gap-2 rounded-lg py-2 hover:bg-indigo-50">
        <Avatar size="sm" src={avatar} />
        <Typography className="group-hover:underline" variant="h6">
          {name}
        </Typography>
      </div>
    </Link>
  );
}

interface ProfilesByPermissionsProps {
  users: User[];
  role: ProjectRoleName;
}

function ProfilesByPermissions({ role, users }: ProfilesByPermissionsProps) {
  return (
    <div className="dark:text-slate-200 mb-1 flex flex-col">
      <Typography variant="h6">
        {pluralize(role) + " - " + users.length}
      </Typography>
      <div className="flex flex-col gap-3">
        {users.map((user) => (
          <div key={user.id}>
            <SidebarProfile name={user?.name ?? ""} avatar={user.image ?? ""} />
          </div>
        ))}
      </div>
    </div>
  );
}

export async function RightSidebar({ projectUrl }: { projectUrl: string }) {
  const users = await api.projects.projectUsersGroupedByRole.query({
    projectUrl,
  });

  return (
    <aside className="hidden h-[calc(100vh-64px)] w-64 min-w-[16rem] flex-col overflow-y-auto border-l bg-gradient-to-b from-indigo-50/50 from-[2%] xl:flex">
      <div className="flex-grow px-4 py-4">
        {Object.entries(users).map(([key, value]) => (
          <ProfilesByPermissions
            key={key}
            role={key as ProjectRoleName}
            users={value.map((user) => user)}
          ></ProfilesByPermissions>
        ))}
      </div>
    </aside>
  );
}
