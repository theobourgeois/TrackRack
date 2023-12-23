"use client";
import {
  Button,
  Dialog,
  DialogFooter,
  DialogHeader,
  Spinner,
} from "@/app/_components/mtw-wrappers";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useSnackBar } from "@/app/_providers/snackbar-provider";
import { type DialogComponentProps } from "@/app/projects/_components/projects/project-header";

type DialogProps = {
  id: string;
};

export function DeleteFileDialog({
  open,
  onClose,
  id,
}: DialogComponentProps<DialogProps>) {
  const router = useRouter();
  const { showSuccessNotification, showErrorNotification } = useSnackBar();
  const { mutate, isLoading } = api.files.delete.useMutation({
    onSuccess: () => {
      router.refresh();
      onClose();
      showSuccessNotification("file deleted");
    },
    onError: (err) => {
      console.error("Error deleting file:", err);
      showErrorNotification("Error deleting track");
    },
  });

  const handleSubmit = () => {
    mutate({
      id,
    });
  };

  return (
    <Dialog size="xs" open={open} handler={onClose}>
      <DialogHeader>
        Are you sure you want to delete this file? This cannot be undone.
      </DialogHeader>
      <DialogFooter className="gap-2">
        <Button onClick={onClose} color="gray" variant="outlined">
          Cancel
        </Button>
        <Button
          disabled={isLoading}
          onClick={handleSubmit}
          type="submit"
          color="red"
          variant="gradient"
        >
          {isLoading ? <Spinner color="indigo" /> : "Delete File"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
