import { createTRPCRouter } from "@/server/api/trpc";
import { tracksRouter } from "./routers/tracks";
import { projectsRouter } from "./routers/projects";
import { commentsRouter } from "./routers/comments";
import { usersRouter } from "./routers/users";
import { invitesRouter } from "./routers/invites";
import { filesRouter } from "./routers/files";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  tracks: tracksRouter,
  projects: projectsRouter,
  comments: commentsRouter,
  users: usersRouter,
  invites: invitesRouter,
  files: filesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
