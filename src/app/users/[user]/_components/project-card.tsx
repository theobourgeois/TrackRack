import { Typography } from "@/app/_components/mtw-wrappers";
import { Project, ProjectRoleName } from "@prisma/client";
import Link from "next/link";

interface ProjectCardProps {
  project: Project;
  role: ProjectRoleName;
}
export function ProjectCard({ project, role }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.urlName}`}>
      <div className="group flex flex-col flex-wrap gap-2">
        <img src={project.coverImage ?? ""} className="h-64 w-64 rounded-md" />
        <div className="h-min ">
          <Typography
            className="w-min cursor-pointer break-words group-hover:underline"
            variant="h3"
          >
            {project.name}
          </Typography>
        </div>
      </div>
    </Link>
  );
}
