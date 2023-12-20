import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";
import { type FileType } from "@prisma/client";
import { utapi } from "@/app/api/uploadthing/server";


export const filesRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        type: z.custom<FileType>(),
        trackId: z.string(),
        url: z.string(),
        createdById: z.string(),
        size: z.number(),
        fileKey: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.file.create({
        data: {
          name: input.name,
          type: input.type,
          url: input.url,
          trackId: input.trackId,
          fileKey: input.fileKey,
          createdById: input.createdById,
          createdAt: new Date(),
          size: input.size,
        },
      })
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const file = await ctx.db.file.delete({
        where: {
          id: input.id,
        },
      })
      return utapi.deleteFiles(file.fileKey);
    }),
});
