import { useRouter } from "next/navigation";
import { DialogComponentProps } from "../projects/project-header";
import { useSnackBar } from "@/app/_providers/snackbar-provider";
import { api } from "@/trpc/react";
import {
  Button,
  Dialog,
  DialogFooter,
  DialogHeader,
  Spinner,
} from "@/app/_components/mtw-wrappers";

type InviteDialogProps = {
  inviteId: string;
};

export function DeleteInviteUserDialog({
  open,
  onClose,
  inviteId,
}: DialogComponentProps<InviteDialogProps>) {
  const router = useRouter();
  const { showSuccessNotification, showErrorNotification } = useSnackBar();

  const { mutate, isLoading } = api.invites.delete.useMutation({
    onSuccess: () => {
      showSuccessNotification("Invite deleted successfully");
      onClose();
      router.refresh();
    },
    onError: () => {
      showErrorNotification("Something went wrong, please try again.");
    },
  });

  const handleDelete = () => {
    mutate({
      id: inviteId,
    });
  };

  return (
    <Dialog open={open} handler={onClose}>
      <DialogHeader>Are you sure you want to delete this invite?</DialogHeader>
      <DialogFooter className="flex gap-2">
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="gradient" onClick={handleDelete} color="red">
          {isLoading ? <Spinner color="indigo" /> : "Delete"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

type ProjectUserDialogProps = {
  userId: string;
  projectId: string;
};

export function DeleteProjectUserDialog({
  open,
  onClose,
  userId,
  projectId,
}: DialogComponentProps<ProjectUserDialogProps>) {
  const router = useRouter();
  const { showSuccessNotification, showErrorNotification } = useSnackBar();

  const { mutate, isLoading } = api.projects.deleteProjectUser.useMutation({
    onSuccess: () => {
      showSuccessNotification("Invite deleted successfully");
      onClose();
      router.refresh();
    },
    onError: () => {
      showErrorNotification("Something went wrong, please try again.");
    },
  });

  const handleDelete = () => {
    mutate({
      userId,
      projectId,
    });
  };

  return (
    <Dialog open={open} handler={onClose}>
      <DialogHeader>
        Are you sure you want to remove this user from the project?
      </DialogHeader>
      <DialogFooter className="flex gap-2">
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="gradient" onClick={handleDelete} color="red">
          {isLoading ? <Spinner color="indigo" /> : "Delete"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
