import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "@/server/api/trpc";
import { incrementName } from "@/app/_utils/db-utils";

export const tracksRouter = createTRPCRouter({
    create: protectedProcedure.input(
        z.object({
            name: z.string().min(1),
            description: z.string().optional(),
            projectUrl: z.string(),
        }),
    ).mutation(async ({ ctx, input }) => {
        const project = await ctx.db.project.findFirst({
            where: {
                urlName: input.projectUrl,
                createdById: ctx.session.user.id,
            },
        });
        const trackUrl = incrementName(input.name, await ctx.db.track.count({
            where: {
                name: input.name,
                projectId: project?.id ?? '',
            },
        }));
        return ctx.db.track.create({
            data: {
                name: input.name,
                description: input.description,
                urlName: trackUrl,
                projectId: project?.id ?? '',
                createdById: ctx.session.user.id,
            },
        });
    }),
    update: protectedProcedure.input(
        z.object({
            id: z.string(),
            name: z.string().min(1),
            description: z.string().optional(),
        }),
    ).mutation(async ({ ctx, input }) => {
        return ctx.db.track.update({
            where: {
                id: input.id,
            },
            data: {
                name: input.name,
                description: input.description,
            },
        });
    }),

});
