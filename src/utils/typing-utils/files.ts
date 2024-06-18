import { type TrackApi } from "./db"

export type FileWithMeta = NonNullable<TrackApi['get']>['files'][number]