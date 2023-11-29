"use client";
import { useRouter } from "next/navigation";
import { useSnackBar } from "../_providers/snackbar-provider";

interface ServerFormProps {
  action: (formData: FormData) => Promise<any>;
  children?: React.ReactNode;
  successMessage?: string;
  errorMessage?: string;
  className?: string;
}

export function ServerForm({
  action,
  children,
  className = "",
  successMessage,
  errorMessage,
}: ServerFormProps) {
  const router = useRouter();
  const { showSuccessNotification, showErrorNotification } = useSnackBar();
  function handleAction(formData: FormData) {
    action(formData)
      .then((data) => {
        const url = data?.url;
        if (url) {
          router.push(url);
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
      .finally(() => {});
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    handleAction(formData);
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      {children}
    </form>
  );
}
