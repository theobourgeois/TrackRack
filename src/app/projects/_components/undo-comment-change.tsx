"use client";
import { Alert, Button } from "@/app/_components/mtw-wrappers";
import { useSnackBar } from "@/app/_providers/snackbar-provider";
import { api } from "@/trpc/react";
import { Comment } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { FaUndo } from "react-icons/fa";
import { twMerge } from "tailwind-merge";
import { DeletedCommentContext } from "../_providers/deleted-comment-provider";
import { CommentType } from "@/app/_utils/typing-utils/comments";

const UNDO_TIMER = 5000;

export function UndoCommentChange({ as }: { as: CommentType }) {
  const { comment, setComment } = useContext(DeletedCommentContext);
  const router = useRouter();
  const { showErrorNotification, showSuccessNotification } = useSnackBar();
  const { mutate } = api.comments.create.useMutation({
    onSuccess: () => {
      router.refresh();
      showSuccessNotification("Comment undone");
    },
    onError: (e) => {
      console.error("Error updating comment:", e);
      showErrorNotification("Error undoing changes");
    },
  });

  useEffect(() => {
    if (!comment) return;
    // hide undo button after UNDO_TIMER seconds
    const timer = setTimeout(() => {
      setComment(null);
    }, UNDO_TIMER);
    return () => clearTimeout(timer);
  }, [comment]);

  const handleUndo = () => {
    if (!comment) return;
    setComment(null);
    mutate({});
  };

  return (
    <div
      className={twMerge(
        "fixed bottom-2 mx-auto flex w-screen translate-y-0 justify-center transition-transform",
        !comment ? "translate-y-40" : "translate-y-0",
      )}
    >
      <Alert
        className="flex w-96 items-center gap-4"
        icon={<FaUndo />}
        action={
          <Button
            variant="text"
            color="white"
            size="sm"
            className="!absolute right-3 top-3"
            onClick={handleUndo}
          >
            Undo
          </Button>
        }
      >
        Undo change?
      </Alert>
    </div>
  );
}
