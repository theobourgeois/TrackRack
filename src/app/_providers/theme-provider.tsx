"use client";
import { ThemeProvider as MThemeProvider } from "@material-tailwind/react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <MThemeProvider>{children}</MThemeProvider>;
}
