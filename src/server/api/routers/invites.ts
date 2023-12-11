import { z } from "zod";

import {
  createTRPCRouter, publicProcedure,
} from "@/server/api/trpc";
import { ProjectRoleName } from "@prisma/client";
import { Resend } from "resend";
import { env } from "@/env";
import ProjectInviteEmail from "@/app/emails/project-invite";

const resend = new Resend(env.EMAIL_API_KEY);

const SEVEN_DAYS = 1000 * 60 * 60 * 24 * 7;

export const invitesRouter = createTRPCRouter({
  create: publicProcedure.input(
    z.object({
      email: z.string(),
      projectId: z.string(),
      role: z.custom<ProjectRoleName>(),
    })
  ).mutation(async ({ ctx, input }) => {
    const invite = await ctx.db.invite.create({
      data: {
        email: input.email,
        projectId: input.projectId,
        role: input.role,
        expires: new Date(Date.now() + SEVEN_DAYS),
      },
    });

    const project = await ctx.db.project.findFirst({
      where: {
        id: input.projectId,
      },
    });

    const sender = await ctx.db.user.findFirst({
      where: {
        id: ctx.session?.user.id,
      },
    });

    const emailData = await resend.emails.send({
      from: "invite-share-noreply@trackrack.app",
      to: input.email,
      subject: "You've been invited to a project!",
      react: ProjectInviteEmail({
        projectName: project?.name ?? "",
        magicLink: `${env.BASE_URL}/project-invite/${invite.id}`,
        senderName: sender?.name ?? "",
      })
    })
    console.log(emailData)

  }),
  get: publicProcedure.input(
    z.object({
      id: z.string(),
    })
  ).query(async ({ ctx, input }) => {
    return ctx.db.invite.findFirst({
      where: {
        id: input.id,
      },
    });
  }),
  update: publicProcedure.input(
    z.object({
      id: z.string(),
      role: z.custom<ProjectRoleName>(),
    })
  ).mutation(async ({ ctx, input }) => {
    return ctx.db.invite.update({
      where: {
        id: input.id,
      },
      data: {
        role: input.role,
      },
    });
  }),

  acceptProjectInvite: publicProcedure.input(
    z.object({
      id: z.string(),
    })
  ).mutation(async ({ ctx, input }) => {
    const invite = await ctx.db.invite.findFirst({
      where: {
        id: input.id,
      },
    });

    const role = await ctx.db.projectRole.findFirst({
      where: {
        name: invite?.role,
      },
    });

    await ctx.db.projectUser.create({
      data: {
        projectId: invite?.projectId ?? "",
        userId: ctx.session?.user.id ?? "",
        roleId: role?.id ?? 0,
      },
    });

    return ctx.db.invite.delete({
      where: {
        id: input.id,
      },
    });
  }),

  delete: publicProcedure.input(
    z.object({
      id: z.string(),
    })
  ).mutation(async ({ ctx, input }) => {
    return ctx.db.invite.delete({
      where: {
        id: input.id,
      },
    });
  }),

});
