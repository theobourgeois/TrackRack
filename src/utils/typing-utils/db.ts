import { type RouterOutputs } from "@/trpc/shared";

export type ProjectApi = RouterOutputs["projects"];
export type TrackApi = RouterOutputs["tracks"];
export type CommentApi = RouterOutputs["comments"];
export type UserApi = RouterOutputs["users"];
export type InviteApi = RouterOutputs["invites"];
export type FileApi = RouterOutputs["files"];