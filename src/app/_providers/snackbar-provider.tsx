"use client";
import { twMerge } from "tailwind-merge";
import { RxCross1 } from "react-icons/rx";
import { FaRegCheckCircle } from "react-icons/fa";
import { MdError } from "react-icons/md";
import React, { useState, createContext, useContext } from "react";
import { v4 as uuidv4 } from "uuid"; // For generating unique IDs
import { Alert } from "../_components/mtw-wrappers";

// @ts-ignore
export const SnackBarContext = createContext<{
  showSuccessNotification: (message: string) => void;
  showErrorNotification: (message: string) => void;
  showWarningNotification: (message: string) => void;
  closeSnackbar: (id: string) => void;
}>()!;

enum SnackBarSeverity {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
}

const SnackBarData = {
  [SnackBarSeverity.SUCCESS]: {
    icon: <FaRegCheckCircle color="white" />,
    color: "green",
  },
  [SnackBarSeverity.ERROR]: {
    icon: <MdError color="white" />,
    color: "red",
  },
  [SnackBarSeverity.WARNING]: {
    icon: "warning",
    color: "yellow",
  },
  [SnackBarSeverity.INFO]: {
    icon: "info",
    color: "blue",
  },
} as const;

export const useSnackBar = () => {
  const snackbar = useContext(SnackBarContext);
  return snackbar;
};

type Snackbar = {
  id: string;
  isOpen: boolean;
  message: string;
  severity: SnackBarSeverity;
};

export const SnackBarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [snackbars, setSnackbars] = useState<Snackbar[]>([]);

  const openSnackbar = (message: string, severity: SnackBarSeverity) => {
    const newSnackbar = {
      id: uuidv4(),
      isOpen: true,
      message,
      severity,
    };
    setSnackbars((snackbars) => [...snackbars, newSnackbar]);
    // close the snackbar after 3 seconds
    setTimeout(() => {
      closeSnackbar(newSnackbar.id);
    }, 3000);
  };

  const closeSnackbar = (id: string) => {
    setSnackbars((snackbars) =>
      snackbars.map((snackbar) =>
        snackbar.id === id ? { ...snackbar, isOpen: false } : snackbar,
      ),
    );
    // remove from snackbar list after the animation is done
    setTimeout(() => {
      setSnackbars((snackbars) =>
        snackbars.filter((snackbar) => snackbar.id !== id),
      );
    }, 500);
  };

  const showSuccessNotification = (message: string) => {
    openSnackbar(message, SnackBarSeverity.SUCCESS);
  };

  const showErrorNotification = (message: string) => {
    openSnackbar(message, SnackBarSeverity.ERROR);
  };

  const showWarningNotification = (message: string) => {
    openSnackbar(message, SnackBarSeverity.WARNING);
  };

  return (
    <SnackBarContext.Provider
      value={{
        showSuccessNotification,
        showErrorNotification,
        showWarningNotification,
        closeSnackbar,
      }}
    >
      {snackbars.map((snackbar, index) => {
        const { color, icon } = SnackBarData[snackbar.severity];
        return (
          <Alert
            style={{
              top: snackbar.isOpen ? `${1 + index * 4}rem` : "",
            }}
            className={twMerge(
              "fixed right-2 top-2 z-[10000] flex w-max items-center transition-all duration-500",
              snackbar.isOpen ? "translate-y-0" : "-translate-y-16",
            )}
            color={color}
            icon={icon}
            variant="gradient"
            action={
              <RxCross1
                className="cursor-pointer"
                onClick={() => closeSnackbar(snackbar.id)}
              />
            }
          >
            {snackbar.message}
          </Alert>
        );
      })}
      {children}
    </SnackBarContext.Provider>
  );
};
