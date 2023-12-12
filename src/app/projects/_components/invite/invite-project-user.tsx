"use client";
import { useRouter } from "next/navigation";
import { useSnackBar } from "@/app/_providers/snackbar-provider";
import { api } from "@/trpc/react";
import {
  Avatar,
  IconButton,
  Select,
  Typography,
} from "@/app/_components/mtw-wrappers";
import SelectOption from "@material-tailwind/react/components/Select/SelectOption";
import { PermissionName, ProjectRoleName } from "@prisma/client";
import { MdDelete } from "react-icons/md";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

type InviteUserProps = {
  email: string;
  role: ProjectRoleName;
  id: string;
  onDelete: (inviteId: string) => () => void;
};

// user that is pending invitation
export function InviteUser({ id, email, role, onDelete }: InviteUserProps) {
  const { showErrorNotification } = useSnackBar();
  const router = useRouter();
  const changeRole = api.invites.update.useMutation({
    onSuccess: () => {
      router.refresh();
    },
    onError: (error) => {
      console.error("Error changing role:", error);
      showErrorNotification("Error changing role");
    },
  });

  const handleChangeRole = (value: ProjectRoleName) => {
    changeRole.mutate({
      id,
      role: value,
    });
  };

  return (
    <div
      className={twMerge(
        "flex items-center justify-between  border-b-blue-gray-50 pb-3",
      )}
    >
      <div className="flex items-start gap-2">
        <div className="flex flex-col">
          <Typography className="font-normal" variant="h6">
            {email}
          </Typography>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <RoleSelect onChange={handleChangeRole} role={role} />
        <IconButton onClick={onDelete(id)} variant="text">
          <MdDelete className="text-indigo-700" size="25" />
        </IconButton>
      </div>
    </div>
  );
}

type ProjectUserUser = {
  id: string;
  name: string;
  image: string;
  role: ProjectRoleName;
  email: string;
};

type ProjectUserProps = {
  user: ProjectUserUser;
  onDelete: (userId: string) => () => void;
  projectUserId: string;
  isAuthUser: boolean;
  userPermissions?: PermissionName[];
};

// user that is already in project
export function ProjectUser({
  projectUserId,
  user,
  userPermissions,
  onDelete,
  isAuthUser,
}: ProjectUserProps) {
  const { name, image, role, email } = user;
  const router = useRouter();
  const { showErrorNotification } = useSnackBar();

  const changeRole = api.projects.updateProjectUser.useMutation({
    onSuccess: () => {
      router.refresh();
    },
    onError: (error) => {
      console.error("Error changing role:", error);
      showErrorNotification("Error changing role");
    },
  });

  const handleChangeRole = (value: ProjectRoleName) => {
    changeRole.mutate({
      projectUserId,
      role: value,
    });
  };

  // if user is owner, or user is admin and can't add/remove admins, show only text.
  const showOnlyText =
    isAuthUser ||
    role === ProjectRoleName.Owner ||
    (role === ProjectRoleName.Admin &&
      !userPermissions?.includes(PermissionName.AddRemoveAdmins));

  const canDeleteUser =
    !isAuthUser && userPermissions?.includes(PermissionName.AddRemoveAdmins);

  return (
    <div className="border-t-1 mt-2 flex items-center justify-between border-t border-b-blue-gray-50 py-3">
      <div className="flex items-start gap-2">
        <Avatar size="sm" src={image} />
        <div className="flex flex-col">
          <Typography variant="h6">{name}</Typography>
          <Typography variant="small">{email}</Typography>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {showOnlyText ? (
          <div>
            <Typography
              className={twMerge(!canDeleteUser && "mr-4")} // give spacing when no delete button
              variant="small"
            >
              {role}
            </Typography>
          </div>
        ) : (
          <RoleSelect onChange={handleChangeRole} role={role} />
        )}

        {canDeleteUser && (
          <IconButton
            onClick={onDelete(user.id)}
            disabled={!canDeleteUser}
            variant="text"
          >
            <MdDelete className="text-indigo-700" size="25" />
          </IconButton>
        )}
      </div>
    </div>
  );
}

function RoleSelect({
  onChange,
  role,
}: {
  role?: ProjectRoleName;
  onChange?: (role: ProjectRoleName) => void;
}) {
  const [selectedRole, setSelectedRole] = useState(role);

  const handleChange = (value?: string) => {
    onChange?.(value as ProjectRoleName);
    setSelectedRole(value as ProjectRoleName);
  };

  // if user can invite admins, show admin in role options
  const roles = Object.values(ProjectRoleName).filter((r) => {
    if (r === ProjectRoleName.Owner) return false;
    if (r === ProjectRoleName.Admin && role !== ProjectRoleName.Admin)
      return true;
    return true;
  });

  return (
    <div className="max-w-40 w-min">
      <Select onChange={handleChange} value={selectedRole} label="Role">
        {roles.map((type) => (
          <SelectOption key={type} value={type}>
            {type}
          </SelectOption>
        ))}
      </Select>
    </div>
  );
}
