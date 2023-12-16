"use client";
import { ImageInput } from "@/app/_components/image-input";
import {
  Button,
  Input,
  Option,
  Select,
  Spinner,
  Textarea,
} from "@/app/_components/mtw-wrappers";
import { useSnackBar } from "@/app/_providers/snackbar-provider";
import { ProjectType } from "@/utils/typing-utils/projects";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function CreateProjectForm() {
  const { showErrorNotification } = useSnackBar();
  const router = useRouter();
  const [formValues, setFormValues] = useState({
    name: "",
    type: ProjectType.ALBUM,
    description: "",
    image: undefined,
  });

  const createProject = api.projects.create.useMutation({
    onSuccess: (data) => {
      router.push(`/projects/${data.urlName}`);
    },
    onError: (e) => {
      showErrorNotification("Error creating project, please try again.");
      console.error("Error creating project:", e);
    },
  });

  const handleChange = (field: string, value?: File | string) => {
    setFormValues({
      ...formValues,
      [field]: value,
    });
  };

  return (
    <div className="mt-4 flex w-full flex-col items-end gap-2">
      <div className="flex w-full flex-col items-center gap-2 md:flex-row  md:items-stretch ">
        <ImageInput
          onChange={(image) => handleChange("image", image)}
          name="image"
        />
        <div className="flex w-full  flex-col gap-2">
          <Input
            value={formValues.name}
            onChange={(e) => handleChange("name", e.target.value)}
            label="name"
            name="name"
          ></Input>
          <div className="h-max">
            <Select
              value={formValues.type}
              onChange={(value) => handleChange("type", value)}
              name="type"
              label="type"
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
              value={formValues.description}
              onChange={(e) => handleChange("description", e.target.value)}
              label="description"
              name="description"
            ></Textarea>
          </div>
        </div>
      </div>
      <Button
        color="indigo"
        variant="gradient"
        disabled={
          createProject.isLoading || !formValues.name || !formValues.type
        }
        onClick={() => {
          createProject.mutate({
            ...formValues,
          });
        }}
      >
        {createProject.isLoading ? (
          <Spinner color="indigo" />
        ) : (
          "Create project"
        )}
      </Button>
    </div>
  );
}
