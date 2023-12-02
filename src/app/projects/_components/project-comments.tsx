import {
  DropDown,
  DropDownHandler,
  DropDownContent,
} from "@/app/_components/drop-down";
import { Button, Typography } from "@/app/_components/mtw-wrappers";
import { DropDownOption } from "@/app/_components/popover-option";
import { MdOutlineSort } from "react-icons/md";
import { AddComment } from "./add-comment";
import { CommentWithUserAndReplies } from "@/app/_utils/typing-utils/comments";
import { CommentComponent } from "./comment";
import { getServerAuthSession } from "@/server/auth";

export async function ProjectComments({
  comments,
  projectId,
}: {
  comments: CommentWithUserAndReplies[];
  projectId: string;
}) {
  const session = await getServerAuthSession();

  return (
    <div className="mt-4 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Typography variant="h5">{comments.length} Comments</Typography>
        <DropDown placement="bottom-end">
          <DropDownHandler>
            <div>
              <Button
                className="flex items-center gap-2"
                variant="text"
                size="sm"
              >
                <MdOutlineSort size="20" /> Sort by
              </Button>
            </div>
          </DropDownHandler>
          <DropDownContent>
            <DropDownOption>Latest</DropDownOption>
            <DropDownOption>Name</DropDownOption>
          </DropDownContent>
        </DropDown>
      </div>
      <div className="mb-4">
        <AddComment
          avatar={session?.user.image ?? ""}
          as="project"
          id={projectId}
        />
      </div>
      <div className="flex w-full flex-col gap-4">
        {comments.map(
          (comment) =>
            session && (
              <CommentComponent
                session={session}
                key={comment.id}
                comment={comment}
                id={projectId}
                as="project"
              />
            ),
        )}
      </div>
    </div>
  );
}
