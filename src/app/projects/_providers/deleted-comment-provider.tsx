"use client";
import { CommentsWithReactionsAndReplies } from "@/app/_utils/typing-utils/comments";
import { createContext, useState } from "react";

export const DeletedCommentContext = createContext<{
  comment: CommentsWithReactionsAndReplies | null;
  setComment: (comment: CommentsWithReactionsAndReplies | null) => void;
}>(null!);

export function DeletedCommentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [comment, setComment] =
    useState<CommentsWithReactionsAndReplies | null>(null);

  return (
    <DeletedCommentContext.Provider value={{ comment, setComment }}>
      {children}
    </DeletedCommentContext.Provider>
  );
}
