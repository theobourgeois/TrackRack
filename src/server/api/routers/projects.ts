import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "@/server/api/trpc";
import { incrementName } from "@/app/_utils/db-utils";
import { ProjectRole } from "@/app/_utils/typing-utils/projects";
import { ProjectUser, User } from "@prisma/client";

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
                },
                where: {
                    urlName: input.projectUrl,
                },
            });
        }),

    update: protectedProcedure
        .input(
            z.object({
                projectId: z.string(),
                name: z.string().min(1),
                description: z.string().optional(),
                type: z.string(),
                coverImage: z.string().optional(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const projectUrl = incrementName(
                input.name,
                await ctx.db.project.count({
                    where: {
                        name: input.name,
                    },
                }),
            );
            return ctx.db.project.update({
                where: {
                    id: input.projectId,
                },
                data: {
                    urlName: projectUrl,
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
            const projectUrl = incrementName(
                input.name,
                await ctx.db.project.count({
                    where: {
                        name: input.name,
                    },
                }),
            );

            const project = await ctx.db.project.create({
                data: {
                    name: input.name,
                    urlName: projectUrl,
                    description: input.description,
                    type: input.type,
                    coverImage: input.coverImage,
                    createdById: ctx.session.user.id,
                },
            });

            return ctx.db.projectUser.create({
                data: {
                    userId: ctx.session.user.id,
                    role: ProjectRole.ADMIN,
                    projectId: project.id,
                },
            });
        }),
    projectUsersGroupedByRole: publicProcedure
        .input(z.object({ projectUrl: z.string() }))
        .query(async ({ ctx, input }) => {
            const project = await ctx.db.project.findFirst({
                where: {
                    urlName: input.projectUrl,
                },
            });
            const projectUsers = await ctx.db.projectUser.findMany({
                where: {
                    projectId: project?.id,
                },
                include: {
                    user: true,
                },
            });

            // Group users by role
            const groupedByRole = projectUsers.reduce<{
                [key in ProjectRole]?: (ProjectUser & { user: User })[];
            }>((group, user) => {
                const role = user.role as ProjectRole;
                group[role] = group[role] || [];
                group[role]?.push(user);
                return group;
            }, {});

            return groupedByRole;
        }),
});
