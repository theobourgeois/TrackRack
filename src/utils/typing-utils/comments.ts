import { type api } from "@/trpc/server";
import { type Comment, type Reaction, type User } from "@prisma/client";

export type ReactionWithUser = Reaction & {
  createdBy: User;
}

type CommentsWithUsers = Comment & {
  createdBy: User;
} & {
  reactions: ReactionWithUser[];
}

export type CommentWithUserAndReplies = Awaited<
  ReturnType<typeof api.comments.getEntityComments.query>
>["comments"][number]



export type CommentType = "project" | "file";
