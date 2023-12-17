"use client";
import {
  TabsHeader as MTabsHeader,
  MenuList as MMenuList,
} from "@material-tailwind/react";
import { type ComponentProps } from "react";

function TabsHeader(props: ComponentProps<typeof MTabsHeader>) {
  return <MTabsHeader {...props} />;
}
function MenuList(props: ComponentProps<typeof MMenuList>): JSX.Element {
  return <MMenuList {...props} />;
}

export { TabsHeader, MenuList };
module.exports = { TabsHeader, MenuList };
