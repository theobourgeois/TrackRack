import { z } from "zod";
import {
    createTRPCRouter,
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
    getProjectUserPermissions: publicProcedure.input(
        z.object({ projectId: z.string(), userId: z.string() })
    ).query(async ({ ctx, input }) => {
        const result = await ctx.db.user.findFirst({
            where: {
                id: input.userId,
            },
            include: {
                projectUsers: {
                    where: {
                        userId: input.userId,
                        projectId: input.projectId
                    },
                    include: {
                        role: {
                            include: {
                                permissions: {
                                    include: {
                                        permission: true,
                                    }
                                }
                            }
                        }
                    }
                },
            }
        });
        return result?.projectUsers[0]?.role.permissions?.map((permission) => permission.permission.name);
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
