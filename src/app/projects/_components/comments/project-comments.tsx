import { Typography } from "@/app/_components/mtw-wrappers";
import { AddComment } from "./add-comment";
import { type CommentWithUserAndReplies } from "@/utils/typing-utils/comments";
import { CommentComponent } from "./comment";
import { PermissionName } from "@prisma/client";
import { ViewMoreComments } from "./view-more-comments";
import { CommentSortBy } from "./comment-sort-by";
import { type Session } from "next-auth";

export async function ProjectComments({
  comments,
  projectId,
  userPermissions,
  commentCount,
  session,
}: {
  comments: CommentWithUserAndReplies[];
  projectId: string;
  userPermissions?: PermissionName[];
  commentCount: number;
  session: Session | null;
}) {
  const noUserPermissions = !userPermissions?.length;

  // don't show comments to users without permissions
  if (noUserPermissions) return null;

  return (
    <div className="mt-4 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Typography variant="h5">{commentCount} Comments</Typography>
        <CommentSortBy />
      </div>
      <div className="mb-4">
        {userPermissions?.includes(PermissionName.AddComments) && (
          <AddComment
            avatar={session?.user.image ?? ""}
            as="project"
            id={projectId}
          />
        )}
      </div>
      <div className="flex w-full flex-col gap-4">
        {comments.map(
          (comment) =>
            session && (
              <CommentComponent
                canDeleteComments={userPermissions?.includes(
                  PermissionName.DeleteComments,
                )}
                session={session}
                key={comment.id}
                comment={comment}
                id={projectId}
                as="project"
              />
            ),
        )}
      </div>
      <div className="mt-4 flex justify-center">
        <ViewMoreComments commentCount={commentCount} />
      </div>
    </div>
  );
}
