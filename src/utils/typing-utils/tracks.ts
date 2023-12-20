import { Track } from "@prisma/client";

export type TrackWithMeta = Track &
{
  _count: {
    files: number;
  };
}