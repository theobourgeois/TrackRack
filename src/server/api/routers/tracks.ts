import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "@/server/api/trpc";
import { incrementName } from "@/utils/db-utils";

export const tracksRouter = createTRPCRouter({
    create: protectedProcedure
        .input(
            z.object({
                name: z.string().min(1),
                description: z.string().optional(),
                projectId: z.string(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const project = await ctx.db.project.findFirst({
                where: {
                    id: input.projectId,
                },
            });
            const trackUrl = incrementName(
                input.name,
                await ctx.db.track.count({
                    where: {
                        name: input.name,
                        projectId: project?.id ?? "",
                    },
                }),
            )!;
            return ctx.db.track.create({
                data: {
                    name: input.name,
                    description: input.description,
                    urlName: trackUrl,
                    projectId: project?.id ?? "",
                    createdById: ctx.session.user.id,
                },
            });
        }),
    update: protectedProcedure
        .input(
            z.object({
                id: z.string().optional(),
                name: z.string().min(1).optional(),
                description: z.string().optional(),
                updatedAt: z.date().optional(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const trackUrl = incrementName(
                input.name,
                await ctx.db.track.count({
                    where: {
                        name: input.name,
                    },
                }),
            );
            return ctx.db.track.update({
                where: {
                    id: input.id,
                },
                data: {
                    urlName: trackUrl,
                    name: input.name,
                    description: input.description,
                    updatedAt: input.updatedAt,
                },
            });
        }),
    delete: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.db.track.delete({
                where: {
                    id: input.id,
                },
            });
        }),
    get: publicProcedure
        .input(z.object({ id: z.string().optional(), urlName: z.string().optional() }))
        .query(async ({ ctx, input }) => {
            return ctx.db.track.findFirst({
                where: {
                    id: input.id,
                    urlName: input.urlName,
                },
                include: {
                    files: {
                        orderBy: {
                            createdAt: "desc",
                        },
                        include: {
                            createdBy: true,
                        }
                    },
                }
            });
        }),
});
