import { type Reaction, type User } from "@prisma/client";
import { type CommentApi } from "./db";

export type ReactionWithUser = Reaction & {
  createdBy: User;
}

export type CommentWithUserAndReplies = CommentApi['getEntityComments']['comments'][number]

export type CommentType = "project" | "file";
