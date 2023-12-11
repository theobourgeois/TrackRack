"use client";
import { Dispatch, createContext, useState } from "react";

export const DeletedCommentContext = createContext<{
  hiddenCommentId: string | null;
  setHiddenCommentId: Dispatch<string | null>;
}>(null!);

export function DeletedCommentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hiddenCommentId, setHiddenCommentId] = useState<string | null>(null);

  return (
    <DeletedCommentContext.Provider
      value={{
        hiddenCommentId,
        setHiddenCommentId,
      }}
    >
      {children}
    </DeletedCommentContext.Provider>
  );
}
