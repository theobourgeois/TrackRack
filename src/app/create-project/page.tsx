import { Typography } from "../_components/mtw-wrappers";
import { CreateProjectForm } from "./_components/create-project-form";

export default function Home() {
  return (
    <main className="mx-auto mt-8 flex w-3/4 flex-col  items-center gap-8 lg:w-1/2">
      <Typography className="w-full text-center" variant="h1">
        Create a Project
      </Typography>
      <CreateProjectForm />
    </main>
  );
}
