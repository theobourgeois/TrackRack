import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { api } from "@/trpc/server";
import { FileType } from "@prisma/client";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { z } from "zod";

const f = createUploadthing();

export const ourFileRouter = {
  trackAudioUploader: f({ audio: { maxFileSize: "8MB", maxFileCount: 10 } })
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
        size: file.size,
      });
      await db.track.update({
        where: {
          id: metadata.input.trackId,
        },
        data: {
          updatedAt: new Date(),
        },
      });
      return { name: file.name };
    }),
  trackImageUploader: f({ image: { maxFileSize: "4MB" } })
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
        size: file.size,
      });
      await db.track.update({
        where: {
          id: metadata.input.trackId,
        },
        data: {
          updatedAt: new Date(),
        },
      });
      return { name: file.name };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
