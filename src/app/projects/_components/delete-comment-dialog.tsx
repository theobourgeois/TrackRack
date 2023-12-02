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

type DialogProps = {
  id: string;
};

export function DeleteCommentDialog({
  open,
  onClose,
  id,
}: DialogComponentProps<DialogProps>) {
  const router = useRouter();
  const { mutate, isLoading } = api.comments.delete.useMutation({
    onSuccess: () => {
      router.refresh();
      onClose();
    },
    onError: (err) => {
      console.error("Error adding track:", err);
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
