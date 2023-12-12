"use client";

import { MdOutlineAddReaction } from "react-icons/md";
import {
  IconButton,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Popover,
  PopoverContent,
  PopoverHandler,
  Spinner,
} from "./mtw-wrappers";
import { useState } from "react";
import { api } from "@/trpc/react";
import { twMerge } from "tailwind-merge";
import { useRouter } from "next/navigation";
import { ReactionWithUser } from "../_utils/typing-utils/comments";

const reactions = ["👍", "👎", "🔥", "😄", "😕", "🎉", "😡", "🚀", "👀"];

interface ReactionSelectorProps {
  commentId: string;
  userReactions: ReactionWithUser[];
  userId: string;
}

// component to add a reaction to a comment
export function ReactionSelector({
  commentId,
  userReactions,
  userId,
}: ReactionSelectorProps) {
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
    <Menu placement="bottom-start">
      <MenuHandler>
        <div>
          <IconButton variant="text" size="sm" className="rounded-full">
            <MdOutlineAddReaction size="20" />
          </IconButton>
        </div>
      </MenuHandler>
      <MenuList className="p-2">
        <MenuItem className="flex items-center gap-2 p-0 hover:bg-white active:bg-white">
          {isLoading && <Spinner color="indigo" />}
          {reactions.map((reaction) => (
            <span
              key={reaction}
              onClick={handleChange(reaction)}
              className={twMerge(
                userReactions.find(
                  (r) => r.type === reaction && userId === r.createdById,
                )
                  ? "opacity-50"
                  : "opacity-100",
                "cursor-pointer text-2xl hover:scale-105 hover:opacity-100",
              )}
            >
              {reaction}
            </span>
          ))}
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
