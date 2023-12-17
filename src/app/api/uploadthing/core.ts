import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { FileType } from "@prisma/client";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { z } from "zod";

const f = createUploadthing();

export const ourFileRouter = {
  trackAudioUploader: f({ audio: { maxFileSize: "8MB", maxFileCount: 2 } })
    .input(
      z.object({
        type: z.custom<FileType>(),
        trackId: z.string(),
      }),
    )
    .middleware(async ({ input }) => {
      const session = await getServerAuthSession();
      if (!session) throw new Error("Unauthorized");
      return { userId: session.user.id, input };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await api.files.create.mutate({
        name: file.name,
        type: metadata.input.type,
        trackId: metadata.input.trackId,
        url: file.url,
        createdById: metadata.userId,
      })
      return { name: file.name };
    }),
  trackImageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async () => {
      const session = await getServerAuthSession();
      if (!session) throw new Error("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {

    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
