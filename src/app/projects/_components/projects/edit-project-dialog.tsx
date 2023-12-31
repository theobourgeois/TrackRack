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
import { type DialogComponentProps } from "./project-header";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useSnackBar } from "@/app/_providers/snackbar-provider";
import { HelperText } from "@/app/_components/input-helper-text";
import { ProjectType } from "@/utils/typing-utils/projects";
import { useState } from "react";
import { ImageInput } from "@/app/_components/image-input";
import { uploadFiles } from "@/utils/uploadthing";

type DialogProps = {
  project: {
    name: string;
    description: string;
    type: ProjectType;
    coverImage: string;
    id: string;
  };
};

type FormValues = Omit<DialogProps["project"], "coverImage"> & { image?: File };

export function EditProjectDialog({
  open,
  onClose,
  project,
}: DialogComponentProps<DialogProps>) {
  const router = useRouter();
  const [formValues, setFormValues] = useState<FormValues>(project);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const { name, description, type, image } = formValues;
  const { showErrorNotification } = useSnackBar();
  const { mutate, error, isLoading } = api.projects.update.useMutation({
    onSuccess: async ({ urlName, name, id }) => {
      setIsUploadingImage(true);
      try {
        await uploadFiles("projectImageUploader", {
          files: image ? [image] : [],
          input: {
            id,
          },
        });
      } catch (error) {
        console.error("error uploading file:", error);
        showErrorNotification("Error uploading file");
      } finally {
        if (name !== project.name) {
          router.push(`/projects/${urlName}`);
          router.refresh();
        } else {
          router.refresh();
        }
        onClose();
      }
    },
    onError: (err) => {
      console.error("Error editing project:", err);
      showErrorNotification("Error updating project");
    },
  });
  const zodError = error?.data?.zodError?.fieldErrors;

  const handleChange =
    (field: keyof FormValues) =>
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
      name: name == project.name ? undefined : name,
      description,
      type,
    });
  };

  return (
    <Dialog open={open} handler={onClose}>
      <DialogHeader>Edit Project Details</DialogHeader>
      <DialogBody className="flex flex-col gap-4 md:flex-row">
        <div className="mx-auto">
          <ImageInput
            name="coverImage"
            onChange={(file) => setFormValues({ ...formValues, image: file })}
            defaultImage={project.coverImage}
          ></ImageInput>
        </div>
        <div className="flex flex-grow flex-col gap-3">
          <HelperText text={zodError?.name?.[0] ?? ""} variant="error">
            <Input
              autoFocus
              value={name}
              onChange={handleChange("name")}
              name="name"
              label="Name"
            />
          </HelperText>
          <div className="h-max">
            <Select
              onChange={handleChange("type")}
              value={type}
              name="type"
              label="Type"
            >
              {Object.values(ProjectType).map((type) => (
                <Option key={type} value={type}>
                  {type}
                </Option>
              ))}
            </Select>
          </div>
          <div className=" h-full flex-grow [&>div]:h-full">
            <Textarea
              value={description}
              onChange={handleChange("description")}
              name="description"
              label="Description"
            />
          </div>
        </div>
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
          {isUploadingImage ? (
            <div className="flex items-center gap-2">
              Uploading image...
              <Spinner color="indigo" />
            </div>
          ) : isLoading ? (
            <Spinner color="indigo" />
          ) : (
            "Edit Project"
          )}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
