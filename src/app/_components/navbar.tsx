import { getServerAuthSession } from "@/server/auth";
import {
  Avatar,
  Button,
  Input,
  Navbar as MNavbar,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Typography,
} from "./mtw-wrappers";
import { Logo } from "./logo";
import { IoSearchOutline } from "react-icons/io5";
import Link from "next/link";
import {
  MobileNavBarProvider,
  MobileNavbarButton,
  MobileNavbarCollapse,
} from "./navbar-mobile-dropdown";
import { CgProfile } from "react-icons/cg";
import { IoHome } from "react-icons/io5";
import { IoIosLogOut } from "react-icons/io";
import { MdOutlineLibraryMusic } from "react-icons/md";
import { api } from "@/trpc/server";
import { type Session } from "next-auth";
import Image from "next/image";
import _ from "lodash";
import pluralize from "pluralize";
import { FaPlus } from "react-icons/fa6";
import { HiChevronUpDown } from "react-icons/hi2";

const navLinks = (session: Session) => [
  <ProjectNavLink session={session} />,
  <Link className="lg:mr-4" href="/">
    <Button size="sm" variant="text" className="flex w-full items-center gap-2">
      <IoHome color="black" size="20" />
      Home
    </Button>
  </Link>,
  <Input icon={<IoSearchOutline />} label="Search" />,
];

async function ProjectNavLink({ session }: { session: Session }) {
  const projects = await api.users.userProjects.query({
    userId: session?.user.id,
  });
  const projectsGroupedByRole = _.groupBy(
    projects,
    (project) => project.role.name,
  );

  return (
    <Menu>
      <MenuHandler>
        <Button
          size="sm"
          variant="text"
          className="flex w-full items-center gap-2"
        >
          <MdOutlineLibraryMusic color="black" size="20" />
          Projects <HiChevronUpDown size="20" />
        </Button>
      </MenuHandler>
      <MenuList>
        <Link className="hover:outline-none" href="/projects">
          <MenuItem className="flex items-center px-1 text-blue-600">
            View all
          </MenuItem>
        </Link>
        <hr className="my-1 hover:outline-none" />
        <div className="max-h-72 overflow-y-auto hover:outline-none">
          {Object.entries(projectsGroupedByRole).map(([role, projects]) => (
            <div key={role} className="hover:border-none">
              <Typography className="text-sm font-bold">
                {pluralize(role)}
              </Typography>

              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.project.urlName}`}
                >
                  <MenuItem className="flex items-center px-1">
                    <Image
                      alt="Project cover image navbar"
                      className="rounded-md"
                      width={24}
                      height={24}
                      src={project.project.coverImage ?? ""}
                    />
                    {project.project.name}
                  </MenuItem>
                </Link>
              ))}
            </div>
          ))}
        </div>

        <hr className="my-1 hover:outline-none" />
        <Link className="hover:outline-none" href="/create-project">
          <MenuItem className="flex items-center gap-2">
            <FaPlus />
            Create new project
          </MenuItem>
        </Link>
      </MenuList>
    </Menu>
  );
}

export async function Navbar() {
  const session = await getServerAuthSession();

  if (!session)
    return (
      <MNavbar className="z-10 h-max max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4">
        <div className="flex justify-between">
          <Logo />
          <div className="flex items-center gap-2">
            <Link href="/auth/signin/">
              <Button color="indigo" variant="outlined">
                Sign in
              </Button>
            </Link>
            <Link href="/auth/signup/">
              <Button color="indigo" variant="gradient">
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      </MNavbar>
    );

  return (
    <MNavbar className="z-10 h-max max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4">
      <MobileNavBarProvider>
        <div className="flex justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <ul className="mb-4 mt-2 hidden flex-col lg:mb-0 lg:mt-0 lg:flex lg:flex-row lg:items-center">
              {navLinks(session)}
            </ul>
            <div className="flex lg:hidden">
              <MobileNavbarButton />
            </div>

            <Menu>
              <MenuHandler>
                <div className="w-10">
                  <Avatar
                    className="cursor-pointer"
                    size="sm"
                    src={session.user.image ?? ""}
                  />
                </div>
              </MenuHandler>

              <MenuList>
                <div className="hover:outline-none">
                  <Typography className="font-bold" variant="small">
                    @{session.user.name}
                  </Typography>
                  <Typography variant="small">
                    {session.user.email ?? ""}
                  </Typography>
                </div>
                <Link
                  className="hover:outline-none"
                  href={`/users/${session.user.name}`}
                >
                  <MenuItem className="flex items-center">
                    <CgProfile size="20" />
                    Profile
                  </MenuItem>
                </Link>
                <hr className="my-1 hover:outline-none" />
                <Link className="hover:outline-none" href="/api/auth/signout">
                  <MenuItem className="flex items-center">
                    <IoIosLogOut size="20" />
                    Sign out
                  </MenuItem>
                </Link>
              </MenuList>
            </Menu>
          </div>
        </div>
        <MobileNavbarCollapse key="1">{navLinks(session)}</MobileNavbarCollapse>
      </MobileNavBarProvider>
    </MNavbar>
  );
}
