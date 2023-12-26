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
import { useRouter } from "next/navigation";
import { useSnackBar } from "@/app/_providers/snackbar-provider";
import { useState } from "react";

enum DeleteStage {
  Confirm = "confirm",
  Delete = "delete",
}

type DialogProps = {
  id: string;
  projectName: string;
};

export function DeleteProjectDialog({
  open,
  onClose,
  id,
  projectName: originalProjectName, // used to confirm deletion
}: DialogComponentProps<DialogProps>) {
  const router = useRouter();
  const { showErrorNotification } = useSnackBar();
  const [stage, setStage] = useState<DeleteStage>(DeleteStage.Confirm);
  const [projectName, setProjectName] = useState("");
  const { mutate, isLoading } = api.projects.delete.useMutation({
    onSuccess: () => {
      router.refresh();
      router.push("/projects");
      onClose();
    },
    onError: (err) => {
      console.error("Error deleting track:", err);
      showErrorNotification(err.message);
    },
  });

  const handleSubmit = () => {
    if (stage === DeleteStage.Confirm) {
      return setStage(DeleteStage.Delete);
    }

    if (projectName === originalProjectName) {
      mutate({
        confirmationName: projectName,
        id,
      });
    }
  };

  return (
    <Dialog size="xs" open={open} handler={onClose}>
      <DialogHeader>
        {stage === DeleteStage.Confirm && (
          <>
            Are you sure you want to delete this project? This cannot be undone.
          </>
        )}
        {stage === DeleteStage.Delete && (
          <>Please type "{originalProjectName}" to confirm deletion.</>
        )}
      </DialogHeader>
      {stage === DeleteStage.Delete && (
        <DialogBody>
          <Input
            label="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
        </DialogBody>
      )}

      <DialogFooter className="gap-2">
        <Button onClick={onClose} color="gray" variant="outlined">
          Cancel
        </Button>

        {stage === DeleteStage.Confirm && (
          <Button
            disabled={isLoading}
            onClick={handleSubmit}
            type="submit"
            color="red"
            variant="gradient"
          >
            Yes
          </Button>
        )}
        {stage === DeleteStage.Delete && (
          <Button
            disabled={isLoading || projectName !== originalProjectName}
            onClick={handleSubmit}
            type="submit"
            color="red"
            variant="gradient"
          >
            {isLoading ? <Spinner color="indigo" /> : "Delete Project"}
          </Button>
        )}
      </DialogFooter>
    </Dialog>
  );
}
