import { getServerAuthSession } from "@/server/auth";
import {
  Avatar,
  Button,
  Input,
  Navbar as MNavbar,
  Popover,
  PopoverContent,
  PopoverHandler,
  Typography,
} from "./mtw-wrappers";
import { Logo } from "./logo";
import { IoSearchOutline } from "react-icons/io5";
import { DropDownOption } from "./popover-option";
import Link from "next/link";
import { DropDown, DropDownContent, DropDownHandler } from "./drop-down";

const navLinks = [
  {
    href: "/",
    text: "Home",
  },
  {
    href: "/projects",
    text: "Projects",
  },
];

export async function Navbar() {
  const session = await getServerAuthSession();

  return (
    <MNavbar className="z-10 h-max max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4">
      <div className="flex justify-between">
        <Logo />
        {session?.user ? (
          <div className="flex items-center gap-4">
            <ul className="mb-4 mt-2 flex flex-col gap-1 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
              {navLinks.map((link) => (
                <Typography
                  key={link.href}
                  as="li"
                  color="blue-gray"
                  className="p-1 font-normal hover:text-black"
                >
                  <Link href={link.href} className="flex items-center">
                    {link.text}
                  </Link>
                </Typography>
              ))}
            </ul>
            <Input icon={<IoSearchOutline />} label="Search" />
            <DropDown closeOnClick={false}>
              <DropDownHandler>
                <div className="w-10">
                  <Avatar
                    className="cursor-pointer"
                    size="sm"
                    src={session.user.image ?? ""}
                  />
                </div>
              </DropDownHandler>
              <DropDownContent className="p-2">
                <DropDownOption href={`/users/${session?.user.name}`}>
                  Profile
                </DropDownOption>
                <DropDownOption>Projects</DropDownOption>
                <DropDownOption href="/api/auth/signout">
                  Sign out
                </DropDownOption>
              </DropDownContent>
            </DropDown>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/api/auth/signin/">
              <Button color="indigo" variant="outlined">
                Sign in
              </Button>
            </Link>
            <Link href="/api/auth/signin/">
              <Button color="indigo" variant="gradient">
                Sign up
              </Button>
            </Link>
          </div>
        )}
      </div>
    </MNavbar>
  );
}
