"use client";
import {
  Button,
  Dialog,
  DialogFooter,
  DialogHeader,
  Spinner,
} from "@/app/_components/mtw-wrappers";
import { DialogComponentProps } from "./project-header";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useSnackBar } from "@/app/_providers/snackbar-provider";

type DialogProps = {
  projectId: string;
  isPrivate: boolean;
};

export function ChangeProjectPrivacyDialog({
  open,
  onClose,
  projectId,
  isPrivate,
}: DialogComponentProps<DialogProps>) {
  const router = useRouter();
  const { showErrorNotification } = useSnackBar();
  const { mutate, isLoading } = api.projects.changePrivacy.useMutation({
    onSuccess: () => {
      router.refresh();
      onClose();
    },
    onError: (err) => {
      showErrorNotification("Error changing privacy");
      console.error("Error changing privacy:", err);
    },
  });

  const handleSubmit = () => {
    mutate({
      projectId,
      isPrivate: !isPrivate,
    });
  };

  return (
    <Dialog size="xs" open={open} handler={onClose}>
      <DialogHeader>
        Are you sure you want to make this project{" "}
        {isPrivate ? "public" : "private"}?
      </DialogHeader>
      <DialogFooter className="gap-2">
        <Button onClick={onClose} color="gray" variant="outlined">
          Cancel
        </Button>
        <Button
          disabled={isLoading}
          onClick={handleSubmit}
          type="submit"
          color="indigo"
          variant="gradient"
        >
          {isLoading ? <Spinner color="indigo" /> : "Yes"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
