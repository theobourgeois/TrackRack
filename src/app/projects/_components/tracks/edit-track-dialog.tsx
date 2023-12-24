"use client";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Spinner,
} from "@/app/_components/mtw-wrappers";
import { type DialogComponentProps } from "../projects/project-header";
import { api } from "@/trpc/react";
import { usePathname, useRouter } from "next/navigation";
import { useSnackBar } from "@/app/_providers/snackbar-provider";
import { HelperText } from "@/app/_components/input-helper-text";
import { type Track } from "@prisma/client";
import { useState } from "react";

type DialogProps = {
  track: Track;
  redirect?: boolean;
};

export function EditTrackDialog({
  open,
  onClose,
  redirect = false,
  track,
}: DialogComponentProps<DialogProps>) {
  const router = useRouter();
  const [formValues, setFormValues] = useState<DialogProps["track"]>(track);
  const pathname = usePathname();
  const { name } = formValues;
  const { showSuccessNotification, showErrorNotification } = useSnackBar();
  const { mutate, error, isLoading } = api.tracks.update.useMutation({
    onSuccess: (track) => {
      if (redirect) {
        const path = pathname.split("/");
        path.pop();
        router.push(`${path.join("/")}/${track.urlName}`);
      }
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
