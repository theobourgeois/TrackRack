/* eslint-disable @typescript-eslint/ban-ts-comment */
/**
 * This file contains wrappers for Material Tailwind components.
 * This is done because server components can't use raw mtw components.
 */
"use client";
import {
  Button as MButton,
  Select as MSelect,
  Dialog as MDialog,
  DialogHeader as MDialogHeader,
  DialogBody as MDialogBody,
  DialogFooter as MDialogFooter,
  Input as MInput,
  Collapse as MCollapse,
  Spinner as MSpinner,
  SpeedDial as MSpeedDial,
  Tooltip as MTooltip,
  Avatar as MAvatar,
  Badge as MBadge,
  Textarea as MTextarea,
  Typography as MTypography,
  Switch as MSwitch,
  Tabs as MTabs,
  Radio as MRadio,
  Alert as MAlert,
  Progress as MProgress,
  Popover as MPopover,
  PopoverContent as MPopoverContent,
  PopoverHandler as MPopoverHandler,
  Checkbox as MCheckbox,
  Navbar as MNavbar,
  Option as MOption,
  Card as MCard,
  CardBody as MCardBody,
  CardFooter as MCardFooter,
  IconButton as MIconButton,
  Menu as MMenu,
  MenuHandler as MMenuHandler,
  MenuList as MMenuList,
  MenuItem as MMenuItem,
  TabsBody as MTabsBody,
  TabPanel as MTabPanel,
  Tab as MTab,
  TabsHeader as MTabsHeader,
  type PopoverContentProps,
  type PopoverProps,
  type PopoverHandlerProps,
} from "@material-tailwind/react";
import {
  useContext,
  type ComponentProps,
  useState,
  createContext,
  useRef,
} from "react";
import ClickAwayListener from "react-click-away-listener";
import { twMerge } from "tailwind-merge";

function Menu(props: ComponentProps<typeof MMenu>): JSX.Element {
  return <MMenu {...props} />;
}

function MenuHandler({
  children,
  ...props
}: ComponentProps<typeof MMenuHandler>): JSX.Element {
  return (
    <MMenuHandler {...props}>
      <div>{children}</div>
    </MMenuHandler>
  );
}

function MenuList({
  className,
  ...props
}: Omit<ComponentProps<typeof MMenuList>, "ref">): JSX.Element {
  return <MMenuList className={twMerge("p-2", className)} {...props} />;
}

function MenuItem({
  icon,
  className,
  children,
  ...props
}: ComponentProps<typeof MMenuItem> & { icon?: React.ReactNode }): JSX.Element {
  return (
    <MMenuItem
      className={twMerge("flex items-center gap-2 px-1", className)}
      {...props}
    >
      {icon}
      {children}
    </MMenuItem>
  );
}

function IconButton(props: ComponentProps<typeof MIconButton>): JSX.Element {
  return <MIconButton {...props} />;
}

function Card(props: ComponentProps<typeof MCard>): JSX.Element {
  return <MCard {...props} />;
}

function CardBody(props: ComponentProps<typeof MCardBody>): JSX.Element {
  return <MCardBody {...props} />;
}

function CardFooter(props: ComponentProps<typeof MCardFooter>): JSX.Element {
  return <MCardFooter {...props} />;
}

function Button(props: ComponentProps<typeof MButton>): JSX.Element {
  return <MButton {...props} />;
}

function Select(props: ComponentProps<typeof MSelect>): JSX.Element {
  return <MSelect color="indigo" {...props} />;
}

function Option(props: ComponentProps<typeof MOption>): JSX.Element {
  return <MOption {...props} />;
}

function Dialog(props: ComponentProps<typeof MDialog>): JSX.Element {
  return <MDialog {...props} />;
}

function DialogHeader(
  props: ComponentProps<typeof MDialogHeader>,
): JSX.Element {
  return <MDialogHeader {...props} />;
}

function DialogBody(props: ComponentProps<typeof MDialogBody>): JSX.Element {
  return <MDialogBody {...props} />;
}

function DialogFooter(
  props: ComponentProps<typeof MDialogFooter>,
): JSX.Element {
  return <MDialogFooter {...props} />;
}

function Input(
  props: Omit<ComponentProps<typeof MInput>, "crossOrigin">,
): JSX.Element {
  return <MInput color="indigo" crossOrigin={undefined} {...props} />;
}

function Collapse(props: ComponentProps<typeof MCollapse>): JSX.Element {
  return <MCollapse {...props} />;
}

function Spinner(props: ComponentProps<typeof MSpinner>): JSX.Element {
  return <MSpinner {...props} />;
}

function SpeedDial(props: ComponentProps<typeof MSpeedDial>): JSX.Element {
  return <MSpeedDial {...props} />;
}

function Tooltip(props: ComponentProps<typeof MTooltip>): JSX.Element {
  return <MTooltip {...props} />;
}

function Avatar(props: ComponentProps<typeof MAvatar>): JSX.Element {
  return <MAvatar {...props} />;
}

function Badge(props: ComponentProps<typeof MBadge>): JSX.Element {
  return <MBadge {...props} />;
}

function Textarea(props: ComponentProps<typeof MTextarea>): JSX.Element {
  return <MTextarea color="indigo" {...props} />;
}

function Typography(props: ComponentProps<typeof MTypography>): JSX.Element {
  return <MTypography {...props} />;
}

function Switch(props: ComponentProps<typeof MSwitch>): JSX.Element {
  return <MSwitch {...props} />;
}

function TabsHeader(props: ComponentProps<typeof MTabsHeader>) {
  return <MTabsHeader {...props} />;
}

function Tabs(props: ComponentProps<typeof MTabs>): JSX.Element {
  return <MTabs {...props} />;
}

function Tab(props: ComponentProps<typeof MTab>): JSX.Element {
  return <MTab {...props} />;
}

function TabsBody(props: ComponentProps<typeof MTabsBody>) {
  return <MTabsBody {...props} />;
}

function TabPanel(props: ComponentProps<typeof MTabPanel>) {
  return <MTabPanel {...props} />;
}

function Radio(props: ComponentProps<typeof MRadio>): JSX.Element {
  return <MRadio {...props} />;
}

function Alert(props: ComponentProps<typeof MAlert>): JSX.Element {
  return <MAlert {...props} />;
}

function Progress(props: ComponentProps<typeof MProgress>): JSX.Element {
  return <MProgress {...props} />;
}

const PopoverContext = createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
  closeOnClick: boolean;
  triggers?: {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
  };
}>(undefined!);

function Popover({
  closeOnClick = true,
  hover = false,
  delay,
  ...rest
}: PopoverProps & { closeOnClick?: boolean; hover?: boolean; delay?: number }) {
  const [open, setOpen] = useState(false);
  const openTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const closePopover = () => {
    if (openTimeoutRef.current && openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
    }
    setOpen(false);
  };

  const triggers = {
    onMouseEnter: () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
      if (delay) {
        openTimeoutRef.current = setTimeout(() => {
          setOpen(true);
        }, delay);
      } else {
        setOpen(true);
      }
    },

    onMouseLeave: () => {
      closeTimeoutRef.current = setTimeout(() => {
        closePopover();
      }, delay ?? 300); // delay before closing, you can adjust this value
    },
  };

  return (
    <PopoverContext.Provider
      value={{
        open,
        setOpen,
        closeOnClick,
        triggers: hover ? triggers : undefined,
      }}
    >
      <MPopover
        animate={{
          mount: { opacity: 1, scale: 1 },
        }}
        {...rest}
        handler={setOpen}
        open={open}
      />
    </PopoverContext.Provider>
  );
}

function PopoverHandler({ children, onClick, ...rest }: PopoverHandlerProps) {
  const { open, setOpen, triggers } = useContext(PopoverContext);
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    onClick?.(e);
    setOpen(!open);
  };
  return (
    <MPopoverHandler onClick={handleClick} {...triggers} {...rest}>
      <div>{children}</div>
    </MPopoverHandler>
  );
}

function PopoverContent({
  className,
  onClick,
  ...props
}: Omit<PopoverContentProps, "ref">) {
  const { setOpen, closeOnClick, triggers } = useContext(PopoverContext);
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    onClick?.(e);
    if (closeOnClick) {
      setOpen(false);
    }
  };

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <MPopoverContent
        {...props}
        {...triggers}
        onClick={handleClick}
        className={twMerge("p-2", className)}
      />
    </ClickAwayListener>
  );
}

function Checkbox(props: ComponentProps<typeof MCheckbox>): JSX.Element {
  return <MCheckbox {...props} />;
}

function Navbar(props: ComponentProps<typeof MNavbar>): JSX.Element {
  return <MNavbar {...props} />;
}

const exports = {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  IconButton,
  Card,
  CardBody,
  CardFooter,
  Button,
  Select,
  Option,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Collapse,
  Spinner,
  SpeedDial,
  Tooltip,
  Avatar,
  Badge,
  Textarea,
  Typography,
  Switch,
  Tabs,
  Tab,
  TabsBody,
  TabPanel,
  Radio,
  Alert,
  Progress,
  Popover,
  PopoverHandler,
  PopoverContent,
  Checkbox,
  Navbar,
  TabsHeader,
};

export {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  IconButton,
  Card,
  CardBody,
  CardFooter,
  Button,
  Select,
  Option,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Collapse,
  Spinner,
  SpeedDial,
  Tooltip,
  Avatar,
  Badge,
  Textarea,
  Typography,
  Switch,
  Tabs,
  Tab,
  TabsBody,
  TabPanel,
  Radio,
  Alert,
  Progress,
  Popover,
  PopoverHandler,
  PopoverContent,
  Checkbox,
  Navbar,
  TabsHeader,
};

module.exports = exports;
