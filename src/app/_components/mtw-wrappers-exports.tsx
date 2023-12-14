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
  TabsHeader as MTabsHeader,
  TabsBody as MTabsBody,
  TabPanel as MTabPanel,
  Tab as MTab,
  PopoverContentProps,
  PopoverProps,
  PopoverHandlerProps,
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
function TabsHeader(props: ComponentProps<typeof MTabsHeader>) {
  return <MTabsHeader {...props} />;
}

export { TabsHeader };
module.exports = { TabsHeader };
