import { api } from "@/trpc/server";
import { ImageInput } from "../_components/image-input";
import {
  Button,
  Input,
  Option,
  Select,
  Textarea,
  Typography,
} from "../_components/mtw-wrappers";
import { ProjectType } from "../_utils/typing-utils/projects";
import { redirect } from "next/navigation";
import { ServerForm } from "../_components/form";

async function createProject(formData: FormData) {
  "use server";
  const name = formData.get("name") as string;
  const type = (formData.get("type") as ProjectType) ?? ProjectType.ALBUM;
  const description = formData.get("description") as string;
  //const coverImage = formData.get("image") as File;

  const project = await api.projects.create.mutate({
    name,
    type,
    description,
    //coverImage,
  });

  redirect(`/projects/${project.urlName}`);
}

export default async function Home() {
  return (
    <main className="mx-auto mt-8 flex w-3/4 flex-col  items-center gap-8 lg:w-1/2">
      <Typography className="w-full text-center" variant="h1">
        Create a Project
      </Typography>
      <ServerForm
        errorMessage="Error creating project. Try again later."
        submitText="Create Project"
        action={createProject}
        className="mt-4 flex w-full flex-col items-end gap-2"
      >
        <div className="flex w-full flex-col items-center gap-2 md:flex-row  md:items-stretch ">
          <ImageInput name="image" />
          <div className="flex w-full  flex-col gap-2">
            <Input label="name" name="name"></Input>
            <div className="h-max">
              <Select label="type" name="type">
                {Object.values(ProjectType).map((type) => (
                  <Option key={type} value={type}>
                    {type}
                  </Option>
                ))}
              </Select>
            </div>
            <div className=" h-full flex-grow [&>div]:h-full">
              <Textarea label="description" name="description"></Textarea>
            </div>
          </div>
        </div>
      </ServerForm>
    </main>
  );
}
