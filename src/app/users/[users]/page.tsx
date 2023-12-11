import { Avatar, Button, Typography } from "@/app/_components/mtw-wrappers";
import { api } from "@/trpc/server";
import Link from "next/link";

export default async function Home({ params }: { params: { users: string } }) {
  const user = await api.users.get.query({
    name: params.users,
  });

  const userProjects = await api.users.userProjects.query({
    userId: user?.id ?? "",
  });

  if (!user) return <div>User not found</div>;

  return (
    <main className="lg:3/4 mx-auto flex w-full flex-col gap-4 px-16 py-8 lg:w-4/5 ">
      <div className="mx-12 mb-12 flex flex-col justify-start gap-4">
        <div className="flex items-start gap-8">
          <Avatar src={user.image ?? ""} className="h-44 w-44" />
          <div className="mt-2 flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <Typography variant="h2">{user.name}</Typography>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="gradient" color="indigo">
                  Follow
                </Button>
                <Button size="sm" variant="outlined" color="indigo">
                  Edit Profile
                </Button>
              </div>
            </div>
            <div className="flex gap-6">
              <div>
                <Typography variant="h5">
                  {userProjects.length}{" "}
                  <span className="font-normal">projects</span>
                </Typography>
              </div>
              <div className="">
                <Typography variant="h5">
                  0 <span className="font-normal">followers</span>
                </Typography>
              </div>
              <div>
                <Typography variant="h5">
                  0 <span className="font-normal">following</span>
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex border-y py-2">
        <div className="flex flex-col gap-2">
          <Typography className="my-8 mb-4 font-normal" variant="h2">
            Projects
          </Typography>
          <div className="flex flex-wrap gap-4">
            {userProjects.map((project) => (
              <Link href={`/projects/${project.project.urlName}`}>
                <div className="flex flex-col flex-wrap gap-2">
                  <img
                    src={project.project.coverImage ?? ""}
                    className="h-64 w-64 rounded-md"
                  />
                  <div className="h-min ">
                    <Typography
                      className="cursor-pointer hover:underline"
                      variant="h3"
                    >
                      {project.project.name}
                    </Typography>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
