"use client";
import Link from "next/link";
import { IconType } from "react-icons";
import { twMerge } from "tailwind-merge";

interface DropDownOptionProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  href?: string;
  icon?: IconType;
  hidden?: boolean;
}
export function DropDownOption({
  children,
  onClick,
  href,
  className,
  hidden = false,
  icon: Icon,
}: DropDownOptionProps) {
  if (hidden) return null;
  return (
    <div
      onClick={onClick}
      className={twMerge(
        "flex cursor-pointer items-center gap-1 p-2 hover:bg-blue-gray-50/50",
        className,
      )}
    >
      {Icon && <Icon className="text-base" />}
      {href ? <Link href={href}>{children}</Link> : children}
    </div>
  );
}
