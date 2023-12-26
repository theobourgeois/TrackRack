import { type File, type User } from "@prisma/client"

export type FileWithMeta = File & {
  createdBy: User;
  _count: {
    comments: number;
  };
}