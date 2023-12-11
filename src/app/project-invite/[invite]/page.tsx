import { Button, Typography } from "@/app/_components/mtw-wrappers";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import { MdError } from "react-icons/md";

export default async function Home({
  params,
  searchParams,
}: {
  params: { invite: string };
  searchParams: { accept: "true" | "false" };
}) {
  const session = await getServerAuthSession();
  const invite = await api.invites.get.query({
    id: params.invite,
  });

  if (!invite || new Date(invite.expires) < new Date()) {
    return (
      <main className="mt-12 flex h-screen w-screen items-start justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-2">
            <MdError size="50" />
            <Typography variant="h1">Invite has expired</Typography>
          </div>
          <form
            action={async () => {
              "use server";
              redirect("/");
            }}
          >
            <Button type="submit" size="lg" variant="gradient" color="indigo">
              Return to home
            </Button>
          </form>
        </div>
      </main>
    );
  }

  const user = await api.users.get.query({
    email: invite?.email ?? "",
  });

  if (!user) {
    redirect(`/auth/signup?invite=${invite?.id}&email=${invite?.email}`);
  }

  if (Boolean(user) && (!session || session.user?.email !== user.email)) {
    redirect(`/auth/signin?invite=${invite?.id}&email=${invite?.email}`);
  }

  const didAccept = searchParams.accept === "true";

  if (didAccept) {
    api.invites.acceptProjectInvite.mutate({
      id: params.invite,
    });
    const project = await api.projects.get.query({
      id: invite?.projectId,
    });
    redirect(`/projects/${project?.urlName}`);
  }

  api.invites.delete.mutate({
    id: params.invite,
  });
  redirect("/");
}
