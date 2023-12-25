import { type api } from "@/trpc/server";
import { type Reaction, type User } from "@prisma/client";

export type ReactionWithUser = Reaction & {
  createdBy: User;
}

export type CommentWithUserAndReplies = Awaited<
  ReturnType<typeof api.comments.getEntityComments.query>
>["comments"][number]



export type CommentType = "project" | "file";
