import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "@/server/api/trpc";
import { Comment, Reaction } from "@prisma/client";

const ZEntityComment = z.union([z.literal("project"), z.literal("track")]);

export const commentsRouter = createTRPCRouter({
    create: protectedProcedure
        .input(
            z.object({
                entityId: z.string(),
                parentId: z.string().optional(),
                text: z.string(),
                as: ZEntityComment,
            }),
        )
        .mutation(async ({ ctx, input }) => {
            return ctx.db.comment.create({
                data: {
                    parentId: input.parentId,
                    text: input.text,
                    createdById: ctx.session.user.id,
                    projectId: input.entityId,
                },
            });
        }),
    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                text: z.string(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            return ctx.db.comment.update({
                where: {
                    id: input.id,
                },
                data: {
                    text: input.text,
                },
            });
        }),
    delete: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.db.comment.delete({
                where: {
                    id: input.id,
                },
                include: {
                    reactions: true,
                    replies: {
                        include: {
                            reactions: true,
                        },
                    },
                },
            });
        }),
    getEntityComments: publicProcedure
        .input(
            z.object({
                id: z.string(),
                as: ZEntityComment,
                viewAmount: z.number().optional().default(10),
                sortBy: z
                    .union([z.literal("desc"), z.literal("asc")])
                    .optional()
                    .default("desc"),
            }),
        )
        .query(async ({ ctx, input }) => {
            const comments = await ctx.db.comment.findMany({
                where: {
                    projectId: input.id,
                    parentId: null,
                },
                take: input.viewAmount,
                include: {
                    createdBy: true,
                    replies: {
                        include: {
                            createdBy: true,
                            reactions: {
                                include: {
                                    createdBy: true,
                                },
                            },
                        },
                        orderBy: {
                            createdAt: "asc",
                        },
                    },
                    reactions: {
                        include: {
                            createdBy: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: input.sortBy ?? "desc",
                },
            });
            return {
                comments,
                count: await ctx.db.comment.count({
                    where: {
                        projectId: input.id,
                    },
                }),
            };
        }),
    addReaction: protectedProcedure
        .input(z.object({ commentId: z.string(), reaction: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const existingReaction = await ctx.db.reaction.findFirst({
                where: {
                    commentId: input.commentId,
                    createdById: ctx.session.user.id,
                    type: input.reaction,
                },
            });

            if (existingReaction) {
                return ctx.db.reaction.delete({
                    where: {
                        id: existingReaction.id,
                    },
                });
            }

            return ctx.db.reaction.create({
                data: {
                    commentId: input.commentId,
                    type: input.reaction,
                    createdById: ctx.session.user.id,
                },
            });
        }),
});
