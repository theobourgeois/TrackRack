"use client";
import { twMerge } from "tailwind-merge";
import { RxCross1 } from "react-icons/rx";
import { FaRegCheckCircle } from "react-icons/fa";
import { MdError } from "react-icons/md";
import React, { useState, createContext, useContext } from "react";
import { v4 as uuidv4 } from "uuid"; // For generating unique IDs

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
    color: "bg-green-500",
  },
  [SnackBarSeverity.ERROR]: {
    icon: <MdError color="white" />,
    color: "bg-red-500",
  },
  [SnackBarSeverity.WARNING]: {
    icon: "warning",
    color: "bg-yellow-500",
  },
  [SnackBarSeverity.INFO]: {
    icon: "info",
    color: "bg-blue-300",
  },
};

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
          <div
            key={snackbar.id}
            className={twMerge(
              "fixed right-2 top-2 z-[1000] flex items-center gap-2 rounded-md px-2 py-4 transition-all duration-500",
              snackbar.isOpen ? "translate-y-0" : "-translate-y-16",
              color,
            )}
            style={{
              top: snackbar.isOpen ? `${1 + index * 4}rem` : "",
            }}
          >
            {icon}
            <p className="text-sm text-white">{snackbar.message}</p>
            <RxCross1
              className="cursor-pointer"
              onClick={() => closeSnackbar(snackbar.id)}
              color="white"
            />
          </div>
        );
      })}
      {children}
    </SnackBarContext.Provider>
  );
};
