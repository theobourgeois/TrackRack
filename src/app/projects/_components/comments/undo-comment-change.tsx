"use client";
import { Alert, Button } from "@/app/_components/mtw-wrappers";
import { useSnackBar } from "@/app/_providers/snackbar-provider";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef } from "react";
import { FaUndo } from "react-icons/fa";
import { twMerge } from "tailwind-merge";
import { DeletedCommentContext } from "../../_providers/deleted-comment-provider";

const UNDO_TIMER = 5000;

export function UndoCommentChange() {
  const { hiddenCommentId, setHiddenCommentId } = useContext(
    DeletedCommentContext,
  );
  const router = useRouter();
  const changesUndone = useRef(false);
  const { showErrorNotification, showSuccessNotification } = useSnackBar();
  const deleteComment = api.comments.delete.useMutation({
    onSuccess: () => {
      router.refresh();
      showSuccessNotification("Comment deleted");
    },
    onError: (e) => {
      console.error("Error updating comment:", e);
      showErrorNotification("Error undoing changes");
    },
  });

  const undoComment = api.comments.hideShow.useMutation({
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
    if (!hiddenCommentId) return;
    // hide undo button after UNDO_TIMER seconds
    const timer = setTimeout(() => {
      if (changesUndone.current) return;
      deleteComment.mutate({
        id: hiddenCommentId,
      });
      setHiddenCommentId(null);
    }, UNDO_TIMER);
    return () => clearTimeout(timer);
  }, [hiddenCommentId]);

  const handleUndo = () => {
    if (!hiddenCommentId) return;
    changesUndone.current = true;
    setHiddenCommentId(null);
    undoComment.mutate({
      id: hiddenCommentId,
      hide: false,
    });
  };

  return (
    <div
      className={twMerge(
        "fixed bottom-2 mx-auto flex w-screen translate-y-0 justify-center transition-transform",
        !hiddenCommentId ? "translate-y-40" : "translate-y-0",
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
            disabled={undoComment.isLoading}
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
