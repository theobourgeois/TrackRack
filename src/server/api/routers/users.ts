import { z } from "zod";
import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "@/server/api/trpc";
import bcrypt from "bcrypt";

const DEFAULT_PFP = "https://wallpapers-clan.com/wp-content/uploads/2022/08/default-pfp-1.jpg"

export const usersRouter = createTRPCRouter({
    getProjectUserPermissions: publicProcedure.input(
        z.object({ projectId: z.string().optional(), userId: z.string(), projectUrl: z.string().optional(), trackId: z.string().optional(), fileId: z.string().optional() })
    ).query(async ({ ctx, input }) => {
        const result = await ctx.db.user.findFirst({
            where: {
                id: input.userId,
            },
            include: {
                projectUsers: {
                    where: {
                        userId: input.userId,
                        projectId: input.projectId,
                        project: {
                            urlName: input.projectUrl,
                            ...(input.trackId && {
                                tracks: {
                                    some: {
                                        id: input.trackId,
                                        ...(
                                            input.fileId && {
                                                files: {
                                                    some: {
                                                        id: input.fileId,
                                                    }
                                                }
                                            }
                                        )
                                    }
                                }
                            })
                        }
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
        input(z.object({ userId: z.string().optional(), userName: z.string().optional() }))
        .query(async ({ ctx, input }) => {
            return ctx.db.projectUser.findMany({
                include: {
                    project: true,
                    role: true,
                },
                where: {
                    userId: input.userId,
                    user: {
                        name: input.userName,
                    },
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
            const existingEmail = await ctx.db.user.findFirst({
                where: {
                    email: input.email,
                },
            });

            if (existingEmail) {
                throw new Error("Email already exists");
            }

            const existingName = await ctx.db.user.findFirst({
                where: {
                    name: input.name,
                },
            });

            if (existingName) {
                throw new Error("Name already exists");
            }

            const hashedPassword = await bcrypt.hash(input.password, 10);
            return ctx.db.user.create({
                data: {
                    email: input.email,
                    name: input.name,
                    hashedPassword,
                    image: DEFAULT_PFP,
                },
            });
        }),
    follow: protectedProcedure
        .input(
            z.object({
                userId: z.string(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const existing = await ctx.db.follower.findFirst({
                where: {
                    followingId: ctx.session.user.id,
                    followerId: input.userId,
                },
            });


            // stop following if already following
            if (existing) {
                return ctx.db.follower.delete({
                    where: {
                        id: existing.id,
                    },
                });
            }

            return ctx.db.follower.create({
                data: {
                    followingId: ctx.session.user.id,
                    followerId: input.userId,
                },
            });
        }),
    isFollowing: protectedProcedure
        .input(
            z.object({
                userId: z.string(),
            }),
        )
        .query(async ({ ctx, input }) => {
            const existing = await ctx.db.follower.findFirst({
                where: {
                    followingId: ctx.session.user.id,
                    followerId: input.userId,
                },
            });

            return Boolean(existing);
        }),
    following: publicProcedure
        .input(
            z.object({
                userName: z.string(),
            }),
        )
        .query(async ({ ctx, input }) => {
            return ctx.db.follower.findMany({
                where: {
                    following: {
                        name: input.userName,
                    },
                },
                include: {
                    follower: {
                        include: {
                            _count: {
                                select: {
                                    followers: true,
                                },
                            },
                        },
                    },
                },
            });
        }),
    followers: publicProcedure
        .input(
            z.object({
                userName: z.string(),
            }),
        )
        .query(async ({ ctx, input }) => {
            return ctx.db.follower.findMany({
                where: {
                    follower: {
                        name: input.userName,
                    },
                },
                include: {
                    following: {
                        include: {
                            _count: {
                                select: {
                                    followers: true,
                                },
                            },
                        },
                    },
                },
            });
        }),
    connectionsCount: publicProcedure
        .input(
            z.object({
                userId: z.string(),
            }),
        )
        .query(async ({ ctx, input }) => {
            const following = await ctx.db.follower.count({
                where: {
                    followingId: input.userId,
                },
            });

            const followers = await ctx.db.follower.count({
                where: {
                    followerId: input.userId,
                },
            });

            return {
                following,
                followers,
            };
        }),

});
