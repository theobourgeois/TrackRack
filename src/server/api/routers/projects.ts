import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "@/server/api/trpc";
import { incrementName } from "@/app/_utils/db-utils";
import { ProjectRole } from "@/app/_utils/typing-utils/projects";
import { ProjectRoleName, ProjectUser, User } from "@prisma/client";


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
            if (!project) throw new Error("Project not created");

            const ownerRoleId = await ctx.db.projectRole.findFirst({
                where: {
                    name: ProjectRoleName.Owner,
                },
            });
            if (!ownerRoleId) throw new Error("Owner role not found");

            return ctx.db.projectUser.create({
                data: {
                    userId: ctx.session.user.id,
                    roleId: ownerRoleId?.id,
                    projectId: project.id,
                },
            });
        }),
    projectUsersGroupedByRole: publicProcedure
        .input(z.object({ projectUrl: z.string() }))
        .query(async ({ ctx, input }) => {
            const projectWithUsers = await ctx.db.project.findFirst({
                where: {
                    urlName: input.projectUrl,
                },
                include: {
                    users: {
                        include: {
                            user: true,
                            role: true,
                        },
                    },
                },
            });

            // Check if projectWithUsers is not null
            if (!projectWithUsers) {
                // Handle the case where the project is not found
                throw new Error('Project not found');
            }

            // Extract the projectUsers array
            const projectUsers = projectWithUsers.users;

            // Group users by role
            const groupedByRole = projectUsers.reduce<{
                [key in ProjectRole]?: (typeof projectUsers[number]['user'])[];
            }>((group, user) => {
                const role = user.role.name as ProjectRole;
                group[role] = group[role] || [];
                group[role]?.push(user.user);
                return group;
            }, {});

            return groupedByRole;
        }),
});
