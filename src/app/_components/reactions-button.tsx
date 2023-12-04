"use client";

import { MdOutlineAddReaction } from "react-icons/md";
import {
  IconButton,
  Popover,
  PopoverContent,
  PopoverHandler,
  Spinner,
} from "./mtw-wrappers";
import { useState } from "react";
import { api } from "@/trpc/react";
import { twMerge } from "tailwind-merge";
import { useRouter } from "next/navigation";

const reactions = ["👍", "👎", "🔥", "😄", "😕", "🎉", "😡", "🚀", "👀"];

interface ReactionButtonProps {
  commentId: string;
}
export function ReactionButton({ commentId }: ReactionButtonProps) {
  const router = useRouter();
  const { mutate, isLoading } = api.comments.addReaction.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const handleChange = (reaction: string) => () => {
    if (isLoading) return;
    mutate({
      commentId,
      reaction,
    });
  };

  return (
    <Popover placement="bottom-start">
      <PopoverHandler>
        <div>
          <IconButton variant="text" size="sm" className="rounded-full">
            <MdOutlineAddReaction size="20" />
          </IconButton>
        </div>
      </PopoverHandler>
      <PopoverContent className="p-2">
        <div className="flex items-center gap-2">
          {isLoading && <Spinner color="indigo" />}
          {reactions.map((reaction) => (
            <span
              key={reaction}
              onClick={handleChange(reaction)}
              className={twMerge(
                "cursor-pointer text-2xl opacity-50 hover:opacity-100",
              )}
            >
              {reaction}
            </span>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
