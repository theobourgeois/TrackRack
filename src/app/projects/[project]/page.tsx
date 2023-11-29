import { ServerForm } from "@/app/_components/form";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Input,
  Option,
  Select,
  Spinner,
  Textarea,
  Typography,
} from "@/app/_components/mtw-wrappers";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { Suspense } from "react";

export default async function Home({
  params,
}: {
  params: { project: string };
}) {
  const project = await api.projects.get.query({
    projectUrl: params.project,
  });

  const handleCreateTrack = async (formData: FormData) => {
    "use server";
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    await api.tracks.create.mutate({
      name,
      description,
      projectUrl: params.project,
    });
  };

  const handleCreateProject = async () => {
    "use server";
    const name = "e";
    const type = "Album";
    const description = "Swaggy album";
    await api.projects.create.mutate({
      name,
      type,
      description,
    });
  };

  const handleCreateComment = async (formData: FormData) => {
    "use server";
    const comment = formData.get("comment") as string;
    await api.comments.create.mutate({
      text: comment,
      projectUrl: params.project,
    });
  };

  return (
    <main className="flex h-max w-screen flex-col items-center justify-center gap-4 p-8">
      <Typography variant="h2">{project?.name}</Typography>
      <Typography variant="h3">{project?.type}</Typography>
      <Typography variant="h4">{project?.description}</Typography>
      <ServerForm className="flex flex-col gap-2" action={handleCreateTrack}>
        <Input label="name" name="name" />
        <Textarea label="description" name="description" />
        <Button type="submit" color="indigo" variant="gradient">
          Create Track
        </Button>
      </ServerForm>
      <ServerForm action={handleCreateProject}>
        <Button type="submit">DO IT</Button>
      </ServerForm>

      <ServerForm
        action={handleCreateComment}
        successMessage="comment successfully created"
        errorMessage="failed to create comment"
      >
        <Textarea label="comment" name="comment" />
        <Button type="submit" color="indigo" variant="gradient">
          Add Comment
        </Button>
      </ServerForm>
      <Typography variant="h2">Tracks</Typography>
      {project?.tracks.map((track) => (
        <Card>
          <CardBody>
            <Typography>{track.name}</Typography>
            <Typography>{track.createdBy.name}</Typography>
            <Typography>{track.createdAt.toString()}</Typography>
          </CardBody>
          <CardFooter className="flex gap-2 pt-0">
            <ServerForm
              successMessage="Track successfully deleted"
              errorMessage="Unable to delete track"
              action={async () => {
                "use server";
                await api.comments.delete.mutate({
                  id: track.id,
                });
              }}
            >
              <Button type="submit" color="indigo">
                Delete Track
              </Button>
            </ServerForm>
          </CardFooter>
        </Card>
      ))}
      <Typography variant="h2">Comments</Typography>
      {project?.comments.map((comment) => (
        <Card>
          <CardBody>
            <Typography>{comment.text}</Typography>
            <Typography>{comment.createdBy.name}</Typography>
            <Typography>{comment.createdAt.toString()}</Typography>
          </CardBody>
          <CardFooter className="flex gap-2 pt-0">
            <ServerForm
              action={async () => {
                "use server";
                api.comments.delete.mutate({
                  id: comment.id,
                });
              }}
            >
              <Button type="submit" color="indigo">
                Edit Comment
              </Button>
            </ServerForm>
            <ServerForm
              action={async () => {
                "use server";
                api.comments.delete.mutate({
                  id: comment.id,
                });
              }}
            >
              <Button type="submit" color="indigo">
                Delete Comment
              </Button>
            </ServerForm>
          </CardFooter>
        </Card>
      ))}
    </main>
  );
}
