import { Typography } from "@/app/_components/mtw-wrappers";
import { PermissionName } from "@prisma/client";
import { CommentSortBy } from "@/app/projects/_components/comments/comment-sort-by";
import { AddComment } from "@/app/projects/_components/comments/add-comment";
import { ViewMoreComments } from "@/app/projects/_components/comments/view-more-comments";
import { CommentComponent } from "@/app/projects/_components/comments/comment";
import { type Session } from "next-auth";
import { type CommentWithUserAndReplies } from "@/utils/typing-utils/comments";

export async function FileComments({
  comments,
  fileId,
  userPermissions,
  commentCount,
  session,
}: {
  comments: CommentWithUserAndReplies[];
  fileId: string;
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
            as="file"
            id={fileId}
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
                id={fileId}
                as="file"
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
