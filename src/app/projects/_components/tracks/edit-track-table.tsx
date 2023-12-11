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
import { Track } from "@prisma/client";
import { useState } from "react";

type DialogProps = {
  track: Track;
};

export function EditTrackDialog({
  open,
  onClose,
  track,
}: DialogComponentProps<DialogProps>) {
  const router = useRouter();
  const [formValues, setFormValues] = useState<DialogProps["track"]>(track);
  const { name, description } = formValues;
  const { showSuccessNotification, showErrorNotification } = useSnackBar();
  const { mutate, error, isLoading } = api.tracks.update.useMutation({
    onSuccess: () => {
      router.refresh();
      onClose();
      showSuccessNotification("Track updated");
    },
    onError: (err) => {
      console.error("Error editing track:", err);
      showErrorNotification("Error updating track");
    },
  });
  const zodError = error?.data?.zodError?.fieldErrors;

  const handleChange =
    (field: keyof DialogProps["track"]) =>
    (
      e?: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string,
    ) => {
      // handles select component which passes string instead of event
      const value = typeof e === "string" ? e : e?.target.value;
      setFormValues({
        ...formValues,
        [field]: value,
      });
    };

  const handleSubmit = () => {
    mutate({
      id: track.id,
      name,
      description: description ?? "",
    });
  };

  return (
    <Dialog open={open} handler={onClose}>
      <DialogHeader>Edit Project Details</DialogHeader>
      <DialogBody className="flex flex-col gap-4">
        <HelperText text={zodError?.name?.[0] ?? ""} variant="error">
          <Input
            value={name}
            onChange={handleChange("name")}
            name="name"
            label="Name"
          />
        </HelperText>
        <Textarea
          value={description ?? ""}
          onChange={handleChange("description")}
          name="description"
          label="Description"
        />
      </DialogBody>
      <DialogFooter className="gap-2">
        <Button onClick={onClose} color="gray" variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          color="indigo"
          variant="gradient"
        >
          {isLoading ? <Spinner color="indigo" /> : "Edit Track"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
