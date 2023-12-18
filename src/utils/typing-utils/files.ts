import { File, User } from "@prisma/client"

export type FileWithMeta = File & {
  createdBy: User;
}