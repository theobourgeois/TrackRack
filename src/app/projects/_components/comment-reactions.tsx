"use client";
import {
  Popover,
  PopoverContent,
  PopoverHandler,
  Typography,
} from "@/app/_components/mtw-wrappers";
import { ReactionButton } from "@/app/_components/reactions-button";
import { ReactionWithUser } from "@/app/_utils/typing-utils/comments";
import { api } from "@/trpc/react";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

interface CommentReactionsProps {
  reactions: ReactionWithUser[];
  session?: Session;
  commentId: string;
}
export function CommentReactions({
  reactions,
  session,
  commentId,
}: CommentReactionsProps) {
  const router = useRouter();
  const { mutate, isLoading } = api.comments.addReaction.useMutation({
    onSuccess: () => {
      router.refresh();
    },
    onError: (e) => {
      console.error("Error adding reaction:", e);
    },
  });

  const handleChange = (reaction: string) => {
    if (isLoading) return;
    mutate({
      commentId,
      reaction,
    });
  };

  return (
    <div className="flex items-center gap-2">
      {reactions.map((reaction) => (
        <Popover key={reaction.id} hover delay={1000}>
          <PopoverHandler>
            <Reaction
              key={reaction.id}
              reaction={reaction.type}
              isUserReaction={session?.user.id === reaction.createdById}
              numberOfReaction={
                reactions.filter((r) => r.type === reaction.type).length
              }
              onChange={handleChange}
            />
          </PopoverHandler>
          <PopoverContent>
            <div className="flex flex-col gap-2">
              {reactions
                .filter((r) => r.type === reaction.type)
                .map((reaction) => (
                  <div key={reaction.id} className="flex items-center gap-2">
                    <Typography variant="h6">
                      {reaction.createdBy.name}
                    </Typography>
                    <Typography variant="h6">{reaction.type}</Typography>
                  </div>
                ))}
            </div>
          </PopoverContent>
        </Popover>
      ))}
      <ReactionButton commentId={commentId} />
    </div>
  );
}

interface ReactionButtonProps {
  reaction: string;
  numberOfReaction: number;
  isUserReaction: boolean;
  onChange: (reaction: string) => void;
}

function Reaction({
  reaction,
  isUserReaction,
  numberOfReaction,
  onChange,
}: ReactionButtonProps) {
  const handleChange = () => {
    onChange(reaction);
  };

  return (
    <div className="flex items-center gap-2">
      <div
        onClick={handleChange}
        className={twMerge(
          "flex w-max cursor-pointer items-center gap-2 rounded-md px-2",
          isUserReaction
            ? "bg-indigo-50 outline outline-2 outline-indigo-500  hover:bg-blue-gray-50 hover:outline-2 hover:outline-blue-gray-200"
            : "outline outline-1 outline-blue-gray-100 hover:bg-blue-gray-50 hover:outline-2 hover:outline-blue-gray-200",
        )}
      >
        <Typography variant="small">{reaction}</Typography>
        <Typography variant="h6">{numberOfReaction}</Typography>
      </div>
    </div>
  );
}
