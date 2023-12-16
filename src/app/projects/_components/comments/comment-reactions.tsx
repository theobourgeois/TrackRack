"use client";
import {
  Popover,
  PopoverContent,
  PopoverHandler,
  Typography,
} from "@/app/_components/mtw-wrappers";
import { ReactionSelector } from "@/app/_components/comment-reactions-selector";
import { ReactionWithUser } from "@/utils/typing-utils/comments";
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

  // reaction type and the number of reactions e.g: { "👍": 2, "👎": 1 }
  const reactionsAndCount = reactions.reduce(
    (acc, reaction) => {
      if (!acc[reaction.type]) {
        acc[reaction.type] = 1;
      } else {
        acc[reaction.type]++;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="flex items-center gap-2">
      {Object.keys(reactionsAndCount).map((reaction) => (
        <Popover key={reaction} hover delay={500}>
          <PopoverHandler>
            <Reaction
              reaction={reaction}
              isUserReaction={Boolean(
                reactions
                  .filter((r) => r.type === reaction)
                  .find((r) => r.createdById === session?.user.id),
              )}
              numberOfReaction={reactionsAndCount[reaction] as number}
              onChange={handleChange}
            />
          </PopoverHandler>
          <PopoverContent>
            <div className="flex flex-col">
              <Typography className="font-normal" variant="paragraph">
                People who reacted with {reaction}
              </Typography>
              {reactions
                .filter((r) => r.type === reaction)
                .map((reaction) => (
                  <div key={reaction.id} className="flex items-center">
                    <Typography variant="paragraph">
                      {reaction.createdBy.name}
                    </Typography>
                  </div>
                ))}
            </div>
          </PopoverContent>
        </Popover>
      ))}
      <ReactionSelector
        userId={session?.user.id ?? ""}
        userReactions={reactions}
        commentId={commentId}
      />
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
