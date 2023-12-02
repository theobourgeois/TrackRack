"use client";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Option,
  Select,
  Spinner,
  Textarea,
} from "@/app/_components/mtw-wrappers";
import { DialogComponentProps } from "./project-header";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useSnackBar } from "@/app/_providers/snackbar-provider";
import { HelperText } from "@/app/_components/input-helper-text";
import { ProjectType } from "@/app/_utils/typing-utils/projects";
import { Project } from "@prisma/client";
import { useState } from "react";
import { ImageInput } from "@/app/_components/image-uploader";

type DialogProps = {
  project: {
    name: string;
    description: string;
    type: ProjectType;
    coverImage: string;
    id: string;
  };
};

export function EditProjectDialog({
  open,
  onClose,
  project,
}: DialogComponentProps<DialogProps>) {
  const router = useRouter();
  const [formValues, setFormValues] = useState<DialogProps["project"]>(project);
  const { name, description, type, coverImage } = formValues;
  const { showSuccessNotification, showErrorNotification } = useSnackBar();
  const { mutate, error, isLoading } = api.projects.update.useMutation({
    onSuccess: ({ urlName }) => {
      router.push(`/projects/${urlName}`);
      onClose();
      showSuccessNotification("Project updated");
    },
    onError: (err) => {
      console.error("Error editing project:", err);
      showErrorNotification("Error updating project");
    },
  });
  const zodError = error?.data?.zodError?.fieldErrors;

  const handleChange =
    (field: keyof DialogProps["project"]) =>
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
      projectId: project.id,
      name,
      description,
      type,
      coverImage,
    });
  };

  return (
    <Dialog open={open} handler={onClose}>
      <DialogHeader>Edit Project Details</DialogHeader>
      <DialogBody className="flex flex-col gap-4">
        <div className="mx-auto">
          <ImageInput name="coverImage" defaultImage={coverImage}></ImageInput>
        </div>
        <HelperText text={zodError?.name?.[0] ?? ""} variant="error">
          <Input
            autoFocus
            value={name}
            onChange={handleChange("name")}
            name="name"
            label="Name"
          />
        </HelperText>
        <Select
          onChange={handleChange("type")}
          value={type}
          name="type"
          label="Type"
        >
          {Object.values(ProjectType).map((type) => (
            <Option value={type}>{type}</Option>
          ))}
        </Select>
        <Textarea
          value={description}
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
          {isLoading ? <Spinner color="indigo" /> : "Edit Project"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
