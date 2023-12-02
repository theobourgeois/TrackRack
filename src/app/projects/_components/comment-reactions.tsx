"use client";
import {
  Popover,
  PopoverContent,
  PopoverHandler,
  Typography,
} from "@/app/_components/mtw-wrappers";
import { ReactionWithUser } from "@/app/_utils/typing-utils/comments";
import { api } from "@/trpc/react";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
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
  });

  const handleChange = (reaction: string) => () => {
    if (isLoading) return;
    mutate({
      commentId,
      reaction,
    });
  };

  return (
    <div className="flex items-center gap-1">
      {reactions.map((reaction) => (
        <Popover key={reaction.id} hover>
          <PopoverHandler>
            <div
              onClick={handleChange(reaction.type)}
              className={twMerge(
                "flex w-max cursor-pointer items-center gap-2 rounded-full px-2 hover:bg-blue-gray-50",
                session?.user.id === reaction.createdById
                  ? "bg-blue-gray-50/75 hover:bg-blue-gray-100/50"
                  : "bg-blue-gray-50/50 hover:bg-blue-gray-50",
              )}
            >
              <Typography variant="h6">{reaction.type}</Typography>
              <Typography variant="h6">
                {reactions.filter((r) => r.type === reaction.type).length}
              </Typography>
            </div>
          </PopoverHandler>
          <PopoverContent>
            <div className="flex flex-col gap-2">
              {reactions
                .filter((r) => r.type === reaction.type)
                .map((reaction) => (
                  <div className="flex items-center gap-2">
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
    </div>
  );
}
