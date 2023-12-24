import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";
import { type FileType } from "@prisma/client";
import { utapi } from "@/app/api/uploadthing/server";
import { incrementName } from "@/utils/db-utils";


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
      const fileUrl = incrementName(
        input.name,
        await ctx.db.file.count({
          where: {
            name: input.name,
          },
        }),
      )
      return ctx.db.file.create({
        data: {
          name: input.name,
          type: input.type,
          url: input.url,
          trackId: input.trackId,
          fileKey: input.fileKey,
          urlName: fileUrl,
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
  get: publicProcedure
    .input(
      z.object({
        id: z.string().optional(),
        fileUrl: z.string().optional(),
        trackUrl: z.string().optional(),
        projectUrl: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.file.findFirst({
        where: {
          id: input.id,
          urlName: input.fileUrl,
          track: {
            urlName: input.trackUrl,
            project: {
              urlName: input.projectUrl,
            }
          }
        },
        include: {
          comments: {
            include: {
              createdBy: true,
              reactions: true,
            },
          },
          track: true,
          createdBy: true,
        }
      })
    }),

});
