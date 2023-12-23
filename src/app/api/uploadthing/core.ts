import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { api } from "@/trpc/server";
import { type FileType } from "@prisma/client";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { z } from "zod";

const f = createUploadthing();

type UploadTrackFileFn = {
  name: string;
  type: FileType;
  trackId: string;
  url: string;
  createdById: string;
  size: number;
  fileKey: string;
}
async function uploadTrackFile({ name, type, trackId, url, fileKey, createdById, size }: UploadTrackFileFn) {
  await api.files.create.mutate({
    name,
    type,
    trackId,
    url,
    fileKey,
    createdById,
    size,
  });
  await db.track.update({
    where: {
      id: trackId,
    },
    data: {
      updatedAt: new Date(),
    },
  });
}

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
      await uploadTrackFile({
        name: file.name,
        type: metadata.input.type,
        trackId: metadata.input.trackId,
        url: file.url,
        fileKey: file.key,
        createdById: metadata.userId,
        size: file.size,
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
      await uploadTrackFile({
        name: file.name,
        type: metadata.input.type,
        trackId: metadata.input.trackId,
        url: file.url,
        fileKey: file.key,
        createdById: metadata.userId,
        size: file.size,
      });
      return { name: file.name };
    }),
  trackBlobUploader: f({ blob: { maxFileSize: "8MB", maxFileCount: 10 } }).input(
    z.object({
      type: z.custom<FileType>(),
      trackId: z.string(),
    }),
  ).middleware(async ({ input }) => {
    const session = await getServerAuthSession();
    if (!session) throw new Error("Unauthorized");
    return { userId: session.user.id, input };
  })
    .onUploadComplete(async ({ metadata, file }) => {
      await uploadTrackFile({
        name: file.name,
        type: metadata.input.type,
        trackId: metadata.input.trackId,
        url: file.url,
        fileKey: file.key,
        createdById: metadata.userId,
        size: file.size,
      });
      return { name: file.name };
    }),
  trackTextUploader: f({ text: { maxFileSize: "4MB", maxFileCount: 10 } }).input(
    z.object({
      type: z.custom<FileType>(),
      trackId: z.string(),
    }),
  ).middleware(async ({ input }) => {
    const session = await getServerAuthSession();
    if (!session) throw new Error("Unauthorized");
    return { userId: session.user.id, input };
  })
    .onUploadComplete(async ({ metadata, file }) => {
      await uploadTrackFile({
        name: file.name,
        type: metadata.input.type,
        trackId: metadata.input.trackId,
        url: file.url,
        fileKey: file.key,
        createdById: metadata.userId,
        size: file.size,
      });
      return { name: file.name };
    }),


} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
