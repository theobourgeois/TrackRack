"use client";
import { Button, Spinner, Typography } from "@/app/_components/mtw-wrappers";
import { PermissionName } from "@prisma/client";
import { AddComment } from "@/app/projects/_components/comments/add-comment";
import { CommentComponent } from "@/app/projects/_components/comments/comment";
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { VscTriangleDown } from "react-icons/vsc";

export function FileComments({
  fileId,
  commentsCount,
}: {
  fileId: string;
  commentsCount: number;
}) {
  const [showComments, setShowComments] = useState(false);

  const toggleShowComments = () => {
    setShowComments((prev) => !prev);
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        className="w-max"
        color="indigo"
        variant="text"
        size="sm"
        onClick={toggleShowComments}
      >
        <div className="flex items-center gap-2">
          <VscTriangleDown className={showComments && "rotate-180"} size="20" />
          <Typography variant="h6">{commentsCount} Comments</Typography>
        </div>
      </Button>
      {showComments && <ShowFileComments fileId={fileId} />}
    </div>
  );
}

function ShowFileComments({ fileId }: { fileId: string }) {
  const comments = api.comments.getEntityComments.useQuery({
    id: fileId,
    as: "file",
  });
  const session = useSession();
  const userPermissions = api.users.getProjectUserPermissions.useQuery({
    userId: session?.data?.user.id ?? "",
    fileId,
  });

  const handleChange = () => {
    comments.refetch().catch((error) => {
      console.error("Error refetching comments:", error);
    });
  };

  if (comments.isLoading || userPermissions.isLoading || !session.data)
    return (
      <div className="w-full justify-center">
        <Spinner color="indigo" />
      </div>
    );

  return (
    <>
      <div className="mb-4">
        {userPermissions.data?.includes(PermissionName.AddComments) && (
          <AddComment
            avatar={session?.data?.user.image ?? ""}
            as="file"
            id={fileId}
          />
        )}
      </div>
      <div className="flex w-full flex-col gap-4">
        {comments.data?.comments.map(
          (comment) =>
            session && (
              <CommentComponent
                canDeleteComments={userPermissions.data?.includes(
                  PermissionName.DeleteComments,
                )}
                onChange={handleChange}
                session={session.data}
                key={comment.id}
                comment={comment}
                id={fileId}
                as="file"
              />
            ),
        )}
      </div>
    </>
  );
}
