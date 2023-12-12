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

const navLinks = [
  <Link href="/">
    <Button size="sm" variant="text" className="flex w-full items-center gap-2">
      <IoHome color="black" size="20" />
      Home
    </Button>
  </Link>,
  <Link href="/create-project">
    <Button
      variant="gradient"
      color="indigo"
      className="flex w-max items-center gap-2"
    >
      + Create Project
    </Button>
  </Link>,
  <Input icon={<IoSearchOutline />} label="Search" />,
];

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
            <ul className="mb-4 mt-2 hidden flex-col lg:mb-0 lg:mt-0 lg:flex lg:flex-row lg:items-center lg:gap-6">
              {navLinks}
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
                <MenuItem className="flex items-center">
                  <CgProfile size="20" />
                  <Link href={`/users/${session.user.name}`}>Profile</Link>
                </MenuItem>
                <MenuItem className="flex items-center border-t">
                  <IoIosLogOut size="20" />
                  <Link href="/api/auth/signout">Sign out</Link>
                </MenuItem>
              </MenuList>
            </Menu>
          </div>
        </div>
        <MobileNavbarCollapse key="1">{navLinks}</MobileNavbarCollapse>
      </MobileNavBarProvider>
    </MNavbar>
  );
}
