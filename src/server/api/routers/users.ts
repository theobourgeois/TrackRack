import { z } from "zod";
import {
    createTRPCRouter,
    publicProcedure,
} from "@/server/api/trpc";
import bcrypt from "bcrypt";

export const usersRouter = createTRPCRouter({
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
    userByEmailAndPassword: publicProcedure.
        input(z.object({ email: z.string() }))
        .query(async ({ ctx, input }) => {
            return ctx.db.user.findFirst({
                where: {
                    email: input.email,
                },
            });
        }),
    get: publicProcedure
        .input(z.object({ id: z.string().optional(), email: z.string().optional(), name: z.string().optional() }))
        .query(async ({ ctx, input }) => {
            return ctx.db.user.findFirst({
                where: {
                    id: input.id,
                    email: input.email,
                    name: input.name,
                },
            });
        }),
    create: publicProcedure
        .input(
            z.object({
                email: z.string(),
                name: z.string(),
                password: z.string(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const hashedPassword = await bcrypt.hash(input.password, 10);
            return ctx.db.user.create({
                data: {
                    email: input.email,
                    name: input.name,
                    hashedPassword,
                },
            });
        }),

});
