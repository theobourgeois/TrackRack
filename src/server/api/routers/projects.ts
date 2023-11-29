import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "@/server/api/trpc";
import { incrementName } from "@/app/_utils/db-utils";

export const projectsRouter = createTRPCRouter({
    get: publicProcedure
        .input(z.object({ projectUrl: z.string() }))
        .query(async ({ ctx, input }) => {
            return ctx.db.project.findFirst({
                include: {
                    tracks: {
                        include: {
                            createdBy: true,
                        },
                        orderBy: {
                            createdAt: "desc",
                        },
                    },
                    users: true,
                    comments: {
                        include: {
                            createdBy: true,
                        },
                        orderBy: {
                            createdAt: "desc",
                        },
                    },
                },
                where: {
                    urlName: input.projectUrl,
                },
            });
        }),
    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                name: z.string().min(1),
                description: z.string().optional(),
                type: z.string(),
                coverImage: z.string().optional(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            return ctx.db.project.update({
                where: {
                    id: input.id,
                },
                data: {
                    name: input.name,
                    description: input.description,
                    type: input.type,
                    coverImage: input.coverImage,
                },
            });
        }),
    create: protectedProcedure
        .input(
            z.object({
                name: z.string().min(1),
                description: z.string().optional(),
                type: z.string(),
                coverImage: z.string().optional(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const projectUrl = incrementName(input.name, await ctx.db.project.count({
                where: {
                    name: input.name,
                },
            }));

            return ctx.db.project.create({
                data: {
                    name: input.name,
                    urlName: projectUrl,
                    description: input.description,
                    type: input.type,
                    coverImage: input.coverImage,
                    createdById: ctx.session.user.id,
                },
            });
        }),
});
