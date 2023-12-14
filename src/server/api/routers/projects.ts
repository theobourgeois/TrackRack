import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "@/server/api/trpc";
import { incrementName } from "@/app/_utils/db-utils";
import { ProjectRole } from "@/app/_utils/typing-utils/projects";
import { PermissionName, ProjectRoleName } from "@prisma/client";

export const projectsRouter = createTRPCRouter({
    get: publicProcedure
        .input(
            z.object({
                projectUrl: z.string().optional(),
                id: z.string().optional(),
            }),
        )
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
                    id: input.id,
                    urlName: input.projectUrl,
                },
            });
        }),

    update: protectedProcedure
        .input(
            z.object({
                projectId: z.string(),
                name: z.string().min(1).optional(),
                description: z.string().optional(),
                type: z.string(),
                coverImage: z.string().optional(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const projectUrl = input.name
                ? incrementName(
                    input.name,
                    await ctx.db.project.count({
                        where: {
                            name: input.name,
                        },
                    }),
                )
                : undefined;
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
    changePrivacy: protectedProcedure
        .input(
            z.object({
                projectId: z.string(),
                isPrivate: z.boolean(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            return ctx.db.project.update({
                where: {
                    id: input.projectId,
                },
                data: {
                    isPrivate: input.isPrivate,
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

            await ctx.db.projectUser.create({
                data: {
                    userId: ctx.session.user.id,
                    roleId: ownerRoleId?.id,
                    projectId: project.id,
                },
            });

            return project;
        }),
    updateProjectUser: protectedProcedure
        .input(
            z.object({
                projectUserId: z.string(),
                role: z.custom<ProjectRoleName>(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const role = await ctx.db.projectRole.findFirst({
                where: {
                    name: input.role,
                },
            });
            if (!role) throw new Error("Role not found");

            return ctx.db.projectUser.update({
                where: {
                    id: input.projectUserId,
                },
                data: {
                    roleId: role.id,
                },
            });
        }),
    delete: protectedProcedure
        .input(z.object({ id: z.string(), confirmationName: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const userDeletingProject = await ctx.db.projectUser.findFirst({
                where: {
                    userId: ctx.session.user.id,
                    projectId: input.id,
                },
                include: {
                    project: true,
                    role: {
                        include: {
                            permissions: {
                                include: {
                                    permission: true,
                                },
                            },
                        },
                    },
                },
            });

            if (!userDeletingProject) {
                throw new Error("User is not a member of this project");
            }

            const hasDeletePermission = Boolean(
                userDeletingProject.role.permissions.find(
                    (permission) =>
                        permission.permission.name === PermissionName.DeleteProjects,
                ),
            );

            if (!hasDeletePermission) {
                throw new Error("You do not have permission to delete this project");
            }

            if (input.confirmationName !== userDeletingProject.project.name) {
                throw new Error("Confirmation name does not match project name");
            }

            return ctx.db.project.delete({
                where: {
                    id: input.id,
                },
            });
        }),
    deleteProjectUser: protectedProcedure
        .input(z.object({ projectId: z.string(), userId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.db.projectUser.delete({
                where: {
                    projectId: input.projectId,
                    userId: input.userId,
                },
            });
        }),
    projectUsersAndInvites: protectedProcedure
        .input(z.object({ projectId: z.string() }))
        .query(async ({ ctx, input }) => {
            const invites = await ctx.db.invite.findMany({
                where: {
                    projectId: input.projectId,
                },
            });

            const projectUsers = await ctx.db.projectUser.findMany({
                where: {
                    projectId: input.projectId,
                },
                include: {
                    user: true,
                    role: true,
                },
            });

            return {
                invites,
                projectUsers,
            };
        }),
    projectUsersGroupedByRole: publicProcedure
        .input(
            z.object({
                projectUrl: z.string().optional(),
                projectId: z.string().optional(),
            }),
        )
        .query(async ({ ctx, input }) => {
            const projectWithUsers = await ctx.db.project.findFirst({
                where: {
                    urlName: input.projectUrl,
                    id: input.projectId,
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

            if (!projectWithUsers) {
                throw new Error("Project not found");
            }

            const projectUsers = projectWithUsers.users;

            const groupedByRole = projectUsers.reduce<{
                [key in ProjectRole]?: (typeof projectUsers)[number]["user"][];
            }>((group, user) => {
                const role = user.role.name as ProjectRole;
                group[role] = group[role] || [];
                group[role]?.push(user.user);
                return group;
            }, {});

            return groupedByRole;
        }),
});
