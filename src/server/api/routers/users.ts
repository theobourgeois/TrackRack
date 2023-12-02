import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "@/server/api/trpc";

export const usersRouter = createTRPCRouter({
    projectUsers: publicProcedure
        .input(z.object({ project: z.string(), user: z.string() }))
        .query(async ({ ctx, input }) => {
            const user = await ctx.db.user.findFirst({
                where: {
                    name: input.user,
                },
            });
            const project = await ctx.db.project.findFirst({
                where: {
                    name: input.project,
                    createdById: user?.id,
                },
            });
            return ctx.db.projectUser.findMany({
                where: {
                    projectId: project?.id,
                },
            });
        }),
    userProjects: publicProcedure.
        input(z.object({ userId: z.string() }))
        .query(async ({ ctx, input }) => {
            return ctx.db.projectUser.findMany({
                include: {
                    project: true,
                },
                where: {
                    userId: input.userId,
                },
            });
        }),
    userByEmail: publicProcedure.
        input(z.object({ email: z.string() }))
        .query(async ({ ctx, input }) => {
            return ctx.db.user.findFirst({
                where: {
                    email: input.email,
                },
            });
        }),
});
