"use client";
import { useRouter } from "next/navigation";
import { useSnackBar } from "../_providers/snackbar-provider";
import { useState } from "react";
import { Button, Spinner } from "./mtw-wrappers";

interface ServerFormProps {
  action: (formData: FormData) => Promise<any>;
  children?: React.ReactNode;
  successMessage?: string;
  errorMessage?: string;
  className?: string;
  submitText?: string;
  redirectUrl?: string;
}

export function ServerForm({
  action,
  children,
  className = "",
  successMessage,
  submitText,
  errorMessage,
  redirectUrl,
}: ServerFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccessNotification, showErrorNotification } = useSnackBar();
  function handleAction(formData: FormData) {
    setIsLoading(true);
    action(formData)
      .then(() => {
        if (redirectUrl) {
          router.push(redirectUrl);
        } else {
          router.refresh();
        }
        if (successMessage) {
          showSuccessNotification(successMessage);
        }
      })
      .catch((err) => {
        if (errorMessage) {
          showErrorNotification(errorMessage);
        }
        console.error(`Error with form:`, err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    handleAction(formData);
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      {children}
      {submitText && (
        <Button
          variant="gradient"
          type="submit"
          color="indigo"
          disabled={isLoading}
        >
          {isLoading ? <Spinner color="indigo" /> : submitText}
        </Button>
      )}
    </form>
  );
}
