import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { FileType } from "@prisma/client";


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
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.file.create({
        data: {
          name: input.name,
          type: input.type,
          url: input.url,
          trackId: input.trackId,
          createdById: input.createdById,
          createdAt: new Date(),
          size: input.size,
        },
      })
    }),
});
