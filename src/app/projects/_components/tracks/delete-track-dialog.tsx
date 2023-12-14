"use client";
import {
  Button,
  Dialog,
  DialogFooter,
  DialogHeader,
  Spinner,
} from "@/app/_components/mtw-wrappers";
import { DialogComponentProps } from "../projects/project-header";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useSnackBar } from "@/app/_providers/snackbar-provider";

type DialogProps = {
  id: string;
};

export function DeleteTrackDialog({
  open,
  onClose,
  id,
}: DialogComponentProps<DialogProps>) {
  const router = useRouter();
  const { showSuccessNotification, showErrorNotification } = useSnackBar();
  const { mutate, isLoading } = api.tracks.delete.useMutation({
    onSuccess: () => {
      router.refresh();
      onClose();
      showSuccessNotification("Track deleted");
    },
    onError: (err) => {
      console.error("Error deleting track:", err);
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
        Are you sure you want to delete this track? This cannot be undone.
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
          {isLoading ? <Spinner color="indigo" /> : "Delete Track"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
