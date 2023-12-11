"use client";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Spinner,
  Textarea,
} from "@/app/_components/mtw-wrappers";
import { DialogComponentProps } from "../projects/project-header";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useSnackBar } from "@/app/_providers/snackbar-provider";
import { HelperText } from "@/app/_components/input-helper-text";

type DialogProps = {
  projectId: string;
};

export function CreateTrackDialog({
  open,
  onClose,
  projectId,
}: DialogComponentProps<DialogProps>) {
  const router = useRouter();
  const { showSuccessNotification, showErrorNotification } = useSnackBar();
  const { mutate, error, isLoading } = api.tracks.create.useMutation({
    onSuccess: () => {
      router.refresh();
      onClose();
      showSuccessNotification("Track created");
    },
    onError: (err) => {
      console.error("Error adding track:", err);
      showErrorNotification("Error creating track");
    },
  });
  const zodError = error?.data?.zodError?.fieldErrors;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    mutate({
      name,
      description,
      projectId,
    });
  };

  return (
    <Dialog open={open} handler={onClose}>
      <form onSubmit={handleSubmit}>
        <DialogHeader>Add a track</DialogHeader>
        <DialogBody className="flex flex-col gap-2">
          <HelperText text={zodError?.name?.[0] ?? ""} variant="error">
            <Input name="name" label="Name" />
          </HelperText>
          <Textarea name="description" label="Description" />
        </DialogBody>
        <DialogFooter className="gap-2">
          <Button onClick={onClose} color="gray" variant="outlined">
            Cancel
          </Button>
          <Button
            disabled={isLoading}
            type="submit"
            color="indigo"
            variant="gradient"
          >
            {isLoading ? <Spinner color="indigo" /> : "Create Track"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
