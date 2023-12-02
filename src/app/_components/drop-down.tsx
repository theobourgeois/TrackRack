"use client";
import {
  MouseEvent,
  MouseEventHandler,
  createContext,
  useContext,
  useState,
} from "react";
import { Popover, PopoverContent, PopoverHandler } from "./mtw-wrappers";
import {
  PopoverContentProps,
  PopoverHandlerProps,
  PopoverProps,
} from "@material-tailwind/react";
import { twMerge } from "tailwind-merge";
import ClickAwayListener from "react-click-away-listener";

const DropDownContext = createContext({
  open: false,
  setOpen: (open: boolean) => {},
  closeOnClick: true,
});

export function DropDown({
  closeOnClick = true,
  ...rest
}: PopoverProps & { closeOnClick?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <DropDownContext.Provider value={{ open, setOpen, closeOnClick }}>
      <Popover {...rest} open={open} />
    </DropDownContext.Provider>
  );
}

export function DropDownHandler({
  children,
  onClick,
  ...rest
}: PopoverHandlerProps) {
  const { setOpen } = useContext(DropDownContext);
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    onClick?.(e);
    setOpen(true);
  };
  return (
    <PopoverHandler onClick={handleClick} {...rest}>
      <div>{children}</div>
    </PopoverHandler>
  );
}

export function DropDownContent({
  className,
  onClick,
  ...props
}: Omit<PopoverContentProps, "ref">) {
  const { setOpen, closeOnClick } = useContext(DropDownContext);
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    onClick?.(e);
    if (closeOnClick) {
      setOpen(false);
    }
  };
  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <PopoverContent
        {...props}
        onClick={handleClick}
        className={twMerge("p-2", className)}
      />
    </ClickAwayListener>
  );
}
