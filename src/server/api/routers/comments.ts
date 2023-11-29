import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "@/server/api/trpc";

export const commentsRouter = createTRPCRouter({
    create: protectedProcedure
        .input(
            z.object({
                projectUrl: z.string(),
                text: z.string(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const project = await ctx.db.project.findFirst({
                where: {
                    urlName: input.projectUrl,
                },
            });
            return ctx.db.comment.create({
                data: {
                    text: input.text,
                    createdById: ctx.session.user.id,
                    projectId: project?.id ?? '',
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
});
