"use client";
import {
  Alert,
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
import { useContext } from "react";

type DialogProps = {
  id: string;
};

export function DeleteCommentDialog({
  open,
  onClose,
  id,
}: DialogComponentProps<DialogProps>) {
  const router = useRouter();
  const { showErrorNotification } = useSnackBar();
  const { mutate, isLoading } = api.comments.delete.useMutation({
    onSuccess: () => {
      router.refresh();
      onClose();
    },
    onError: (err) => {
      showErrorNotification("Error deleting comment");
      console.error("Error deleting comment:", err);
    },
  });

  const handleSubmit = () => {
    mutate({
      id,
    });
  };

  return (
    <Dialog open={open} handler={onClose}>
      <DialogHeader>Are you sure you want to delete this comment?</DialogHeader>
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
          {isLoading ? <Spinner color="indigo" /> : "Delete Comment"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}