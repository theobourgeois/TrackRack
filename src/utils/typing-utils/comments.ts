import { type Comment, type Reaction, type User } from "@prisma/client";

export type ReactionWithUser = Reaction & {
  createdBy: User;
}

type CommentsWithUsers = Comment & {
  createdBy: User;
} & {
  reactions: ReactionWithUser[];
}

export type CommentWithUserAndReplies = Comment & CommentsWithUsers & {
  replies: CommentWithUserAndReplies[];
}

export type CommentType = "project" | "track";
