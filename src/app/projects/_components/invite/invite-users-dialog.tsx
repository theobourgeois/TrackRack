"use client";
import { DialogComponentProps } from "../projects/project-header";
import { useSnackBar } from "@/app/_providers/snackbar-provider";
import { Dialog, DialogBody } from "@material-tailwind/react";
import { api } from "@/trpc/react";
import {
  Button,
  DialogHeader,
  IconButton,
  Input,
  Spinner,
  Typography,
} from "@/app/_components/mtw-wrappers";
import { PermissionName, ProjectRoleName } from "@prisma/client";
import { useState } from "react";
import { EMAIL_REGEX } from "@/app/_utils/validation";
import { InviteUser, ProjectUser } from "./invite-project-user";
import {
  DeleteInviteUserDialog,
  DeleteProjectUserDialog,
} from "./delete-invite-user-dialog";
import { Session } from "next-auth";
import { RxCross1 } from "react-icons/rx";

enum InviteUsersDialogsDialogs {
  DELETE_INVITE = "DELETE_INVITE",
  DELETE_PROJECT_USER = "DELETE_PROJECT_USER",
}

type DialogProps = {
  projectId: string;
  userPermissions: PermissionName[];
  session: Session;
};

export function InviteUsersDialog({
  open,
  onClose,
  projectId,
  userPermissions,
  session,
}: DialogComponentProps<DialogProps>) {
  const [dialog, setDialog] = useState<{
    type: InviteUsersDialogsDialogs;
    props: { [key: string]: string };
  } | null>(null);
  const { showSuccessNotification, showErrorNotification } = useSnackBar();
  const invitesAndProjectUsers = api.projects.projectUsersAndInvites.useQuery({
    projectId,
  });
  const projectUsers = invitesAndProjectUsers.data?.projectUsers;
  const invites = invitesAndProjectUsers.data?.invites;

  const handleDeleteInvite = (inviteId: string) => () => {
    setDialog({
      type: InviteUsersDialogsDialogs.DELETE_INVITE,
      props: {
        inviteId,
      },
    });
  };

  const handleDeleteProjectUser = (userId: string) => () => {
    setDialog({
      type: InviteUsersDialogsDialogs.DELETE_PROJECT_USER,
      props: {
        userId,
      },
    });
  };

  const renderDialog = () => {
    const dialogProps = {
      open: true,
      onClose: () => {
        setDialog(null);
        invitesAndProjectUsers.refetch();
      },
    };

    switch (dialog?.type) {
      case InviteUsersDialogsDialogs.DELETE_INVITE:
        return (
          <DeleteInviteUserDialog
            {...dialogProps}
            inviteId={dialog?.props.inviteId ?? ""}
          />
        );
      case InviteUsersDialogsDialogs.DELETE_PROJECT_USER:
        return (
          <DeleteProjectUserDialog
            onClose={onClose}
            open={open}
            projectId={projectId}
            userId={dialog?.props.userId ?? ""}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} handler={onClose}>
      {renderDialog()}

      <DialogHeader>
        <div className="flex w-full items-center justify-between">
          <Typography variant="h3">Invite Users</Typography>
          <IconButton onClick={onClose} variant="text">
            <RxCross1 size="25" />
          </IconButton>
        </div>
      </DialogHeader>

      <div className="mx-4">
        <DialogBody className="flex w-full flex-col gap-2 px-0 pt-0">
          <InviteUserForm
            emails={projectUsers?.map((user) => user.user.email ?? "") ?? []}
            projectId={projectId}
          />
          {invitesAndProjectUsers.isLoading && (
            <Spinner className="mt-4" color="indigo" />
          )}
          {projectUsers?.map((user) => {
            return (
              <ProjectUser
                isAuthUser={user.user.id === session.user.id}
                projectUserId={user.id}
                onDelete={handleDeleteProjectUser}
                userPermissions={userPermissions}
                user={{
                  id: user.user.id,
                  name: user.user.name ?? "",
                  image: user.user.image ?? "",
                  role: user.role.name,
                  email: user.user.email ?? "",
                }}
              />
            );
          })}
          {Boolean(invites?.length) && (
            <>
              <Typography className="border-t pt-3" variant="h3">
                Pending invites
              </Typography>
              {invites?.map((invite) => {
                return (
                  <InviteUser
                    onDelete={handleDeleteInvite}
                    id={invite.id}
                    email={invite.email}
                    role={invite.role}
                  />
                );
              })}
            </>
          )}
        </DialogBody>
      </div>
    </Dialog>
  );
}

function InviteUserForm({
  projectId,
  emails,
}: {
  projectId: string;
  emails: string[];
}) {
  const [email, setEmail] = useState("");
  const isEmailValid =
    RegExp(EMAIL_REGEX).test(email) && !emails.includes(email);
  const { showErrorNotification, showSuccessNotification } = useSnackBar();
  const { mutate, isLoading } = api.invites.create.useMutation({
    onSuccess: () => {
      setEmail("");
      showSuccessNotification("Invite sent");
    },
    onError: (error) => {
      console.error("Error inviting user:", error);
      showErrorNotification("Error inviting user");
    },
  });

  const handleSubmit = () => {
    mutate({
      email,
      role: ProjectRoleName.Listener,
      projectId,
    });
  };

  return (
    <div className="flex gap-2">
      <div className="w-full flex-grow">
        <Input
          error={emails.includes(email)}
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          label="User email"
        ></Input>
        {emails.includes(email) && (
          <Typography variant="small" color="red">
            User already in project
          </Typography>
        )}
      </div>

      <div className="flex-grow">
        <Button
          disabled={!isEmailValid || isLoading}
          onClick={handleSubmit}
          variant="gradient"
          color="indigo"
        >
          {isLoading ? <Spinner color="indigo" /> : "Invite"}
        </Button>
      </div>
    </div>
  );
}
