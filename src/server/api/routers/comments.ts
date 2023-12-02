import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "@/server/api/trpc";

const ZEntityComment = z.union([
    z.literal("project"),
    z.literal("track"),
])

export const commentsRouter = createTRPCRouter({
    create: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                parentId: z.string().optional(),
                text: z.string(),
                as: ZEntityComment
            }),
        )
        .mutation(async ({ ctx, input }) => {
            return ctx.db.comment.create({
                data: {
                    parentId: input.parentId,
                    text: input.text,
                    createdById: ctx.session.user.id,
                    projectId: input.id,
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
            });
        }),
    getEntityComments: publicProcedure.
        input(z.object({ id: z.string(), as: ZEntityComment }))
        .query(async ({ ctx, input }) => {
            return ctx.db.comment.findMany({
                where: {
                    projectId: input.id,
                    parentId: null,
                },
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
                    createdAt: "desc",
                }
            });
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
