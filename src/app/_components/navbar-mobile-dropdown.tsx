"use client";
import { useState } from "react";
import Link from "next/link";
import { Logo } from "./logo";
import { RxCross2 } from "react-icons/rx";
import { FiMenu } from "react-icons/fi";
import { Card, Collapse, IconButton, Typography } from "./mtw-wrappers";
import { MobileNav } from "@material-tailwind/react";
import { IconType } from "react-icons";

export function NavbarMobileDropdown({
  navLinks,
}: {
  navLinks: { href: string; text: string; icon: React.ReactNode }[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="block lg:hidden">
      <div className="flex w-full items-center justify-between">
        <Logo />
        <IconButton variant="text">
          {isOpen ? (
            <RxCross2 size="40" color="black" onClick={handleToggleOpen} />
          ) : (
            <FiMenu size="40" color="black" onClick={handleToggleOpen} />
          )}
        </IconButton>
      </div>
      <Collapse open={isOpen}>
        <div className="mt-2">
          {navLinks.map(({ href, text, icon }) => (
            <Link key={text} href={href}>
              <div className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-blue-gray-50/50">
                {icon}
                <Typography className="font-medium" color="black" variant="h6">
                  {text}
                </Typography>
              </div>
            </Link>
          ))}
        </div>
      </Collapse>
    </div>
  );
}
