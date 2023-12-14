import { Typography } from "@/app/_components/mtw-wrappers";
import { Project, ProjectRoleName } from "@prisma/client";
import Link from "next/link";

interface ProjectCardProps {
  project: Project;
  role: ProjectRoleName;
}
export function ProjectCard({ project, role }: ProjectCardProps) {
  return (
    <div>
      <Link href={`/projects/${project.urlName}`}>
        <div className="group flex flex-col flex-wrap gap-2">
          <img
            src={project.coverImage ?? ""}
            className="h-64 w-64 rounded-md"
          />
          <Typography
            className="w-64 max-w-full cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap group-hover:underline"
            title={project.name}
            variant="h3"
          >
            {project.name}
          </Typography>
          <Typography variant="lead">{role}</Typography>
        </div>
      </Link>
    </div>
  );
}
