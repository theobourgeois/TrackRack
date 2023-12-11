import { api } from "@/trpc/server";
import {
  Avatar,
  Button,
  Popover,
  PopoverContent,
  PopoverHandler,
  Typography,
} from "../../../_components/mtw-wrappers";
import pluralize from "pluralize";
import { ProjectRoleName, User } from "@prisma/client";
import Link from "next/link";
import { ProfileCard } from "@/app/_components/profile-card";

interface SidebarProfileProps {
  name: string;
  avatar: string;
}

function SidebarProfile({ name, avatar }: SidebarProfileProps) {
  return (
    <Popover delay={300} hover placement="bottom-start">
      <div className="flex cursor-pointer select-none gap-2 rounded-lg">
        <Avatar size="sm" src={avatar} />
        <Link href={`/users/${name}`}>
          <Typography className="hover:underline" variant="h6">
            {name}
          </Typography>
        </Link>
      </div>
    </Popover>
  );
}

interface ProfilesByPermissionsProps {
  users: User[];
  role: ProjectRoleName;
}

function ProfilesByPermissions({ role, users }: ProfilesByPermissionsProps) {
  return (
    <div className="dark:text-slate-200 mb-5 flex flex-col gap-2">
      <Typography variant="h5">
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
    <aside className="hidden h-[calc(100vh-64px)] w-64 min-w-[16rem] flex-col overflow-y-auto bg-blue-gray-50/50 xl:flex">
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
