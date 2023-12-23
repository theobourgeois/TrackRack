import { Typography } from "@/app/_components/mtw-wrappers";
import { type Project, type ProjectRoleName } from "@prisma/client";
import Image from "next/image";
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
          <Image
            src={project.coverImage ?? ""}
            alt={project.coverImage ?? ""}
            width={256}
            height={100}
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
