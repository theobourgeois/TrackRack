"use client";
import {
  Button as MButton,
  Select as MSelect,
  Dialog as MDialog,
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
  Checkbox as MCheckbox,
  Navbar as MNavbar,
  Option as MOption,
  Card as MCard,
  CardBody as MCardBody,
  CardFooter as MCardFooter,
} from "@material-tailwind/react";
import type { ComponentProps } from "react";

export function Card(props: ComponentProps<typeof MCard>): JSX.Element {
  return <MCard {...props} />;
}

export function CardBody(props: ComponentProps<typeof MCardBody>): JSX.Element {
  return <MCardBody {...props} />;
}

export function CardFooter(
  props: ComponentProps<typeof MCardFooter>,
): JSX.Element {
  return <MCardFooter {...props} />;
}

export function Button(props: ComponentProps<typeof MButton>): JSX.Element {
  return <MButton {...props} />;
}

export function Select(props: ComponentProps<typeof MSelect>): JSX.Element {
  return <MSelect {...props} />;
}

export function Option(props: ComponentProps<typeof MOption>): JSX.Element {
  return <MOption {...props} />;
}

export function Dialog(props: ComponentProps<typeof MDialog>): JSX.Element {
  return <MDialog {...props} />;
}

export function Input(
  props: Omit<ComponentProps<typeof MInput>, "crossOrigin">,
): JSX.Element {
  return <MInput crossOrigin={undefined} {...props} />;
}

export function Collapse(props: ComponentProps<typeof MCollapse>): JSX.Element {
  return <MCollapse {...props} />;
}

export function Spinner(props: ComponentProps<typeof MSpinner>): JSX.Element {
  return <MSpinner {...props} />;
}

export function SpeedDial(
  props: ComponentProps<typeof MSpeedDial>,
): JSX.Element {
  return <MSpeedDial {...props} />;
}

export function Tooltip(props: ComponentProps<typeof MTooltip>): JSX.Element {
  return <MTooltip {...props} />;
}

export function Avatar(props: ComponentProps<typeof MAvatar>): JSX.Element {
  return <MAvatar {...props} />;
}

export function Badge(props: ComponentProps<typeof MBadge>): JSX.Element {
  return <MBadge {...props} />;
}

export function Textarea(props: ComponentProps<typeof MTextarea>): JSX.Element {
  return <MTextarea {...props} />;
}

export function Typography(
  props: ComponentProps<typeof MTypography>,
): JSX.Element {
  return <MTypography {...props} />;
}

export function Switch(props: ComponentProps<typeof MSwitch>): JSX.Element {
  return <MSwitch {...props} />;
}

export function Tabs(props: ComponentProps<typeof MTabs>): JSX.Element {
  return <MTabs {...props} />;
}

export function Radio(props: ComponentProps<typeof MRadio>): JSX.Element {
  return <MRadio {...props} />;
}

export function Alert(props: ComponentProps<typeof MAlert>): JSX.Element {
  return <MAlert {...props} />;
}

export function Progress(props: ComponentProps<typeof MProgress>): JSX.Element {
  return <MProgress {...props} />;
}

export function Popover(props: ComponentProps<typeof MPopover>): JSX.Element {
  return <MPopover {...props} />;
}

export function Checkbox(props: ComponentProps<typeof MCheckbox>): JSX.Element {
  return <MCheckbox {...props} />;
}

export function Navbar(props: ComponentProps<typeof MNavbar>): JSX.Element {
  return <MNavbar {...props} />;
}
