import { Typography } from "@/app/_components/mtw-wrappers";
import { AddComment } from "./add-comment";
import { CommentWithUserAndReplies } from "@/app/_utils/typing-utils/comments";
import { CommentComponent } from "./comment";
import { getServerAuthSession } from "@/server/auth";
import { PermissionName } from "@prisma/client";
import { ViewMoreComments } from "./view-more-comments";
import { CommentSortBy } from "./comment-sort-by";
import { DeletedCommentProvider } from "../_providers/deleted-comment-provider";

export async function ProjectComments({
  comments,
  projectId,
  userPermissions,
  commentCount,
}: {
  comments: CommentWithUserAndReplies[];
  projectId: string;
  userPermissions?: PermissionName[];
  commentCount: number;
}) {
  const session = await getServerAuthSession();
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
        <DeletedCommentProvider>
          <>
            {/* <UndoCommentChange as="project" /> */}
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
          </>
        </DeletedCommentProvider>
      </div>
      <div className="mt-4 flex justify-center">
        <ViewMoreComments commentCount={commentCount} />
      </div>
    </div>
  );
}
