"use client";
import { Typography } from "./mtw-wrappers";

const helperTextVariants = {
  error: {
    color: "red",
    icon: <></>,
  },
  success: {
    color: "green",
    icon: <></>,
  },
  info: {
    color: "blue",
    icon: <></>,
  },
  neutral: {
    color: "gray",
    icon: <></>,
  },
} as const;

type HelperTextProps = {
  children: React.ReactNode;
  variant: "error" | "success" | "info" | "neutral";
  showIcon?: boolean;
  text: string;
};
export function HelperText({
  children,
  variant = "info",
  text,
  showIcon = true,
}: HelperTextProps) {
  const { color, icon } = helperTextVariants[variant];

  return (
    <div>
      {children}
      {text && (
        <Typography
          variant="small"
          color={color}
          className="mt-1 flex items-center gap-1 font-normal"
        >
          {showIcon && <span>{icon}</span>}
          {text}
        </Typography>
      )}
    </div>
  );
}
