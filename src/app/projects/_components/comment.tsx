"use client";
import {
  DropDown,
  DropDownContent,
  DropDownHandler,
} from "@/app/_components/drop-down";
import {
  Avatar,
  Button,
  IconButton,
  Typography,
} from "@/app/_components/mtw-wrappers";
import { DropDownOption } from "@/app/_components/popover-option";
import { getDateString } from "@/app/_utils/date-utils";
import {
  CommentType,
  CommentWithUserAndReplies,
} from "@/app/_utils/typing-utils/comments";
import { FaEdit } from "react-icons/fa";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { MdDelete, MdOutlineAddReaction } from "react-icons/md";
import { useState } from "react";
import { DeleteCommentDialog } from "./delete-comment-dialog";
import { VscTriangleDown } from "react-icons/vsc";
import { AddComment } from "./add-comment";
import { ReactionButton } from "@/app/_components/reactions-button";
import { CommentReactions } from "./comment-reactions";
import { Session } from "next-auth";

export enum CommentDialogs {
  DELETE = "DELETE",
}

type CommentComponentProps = {
  comment: CommentWithUserAndReplies;
  id: string;
  as: CommentType;
  session?: Session;
  parentId?: string;
};

export function CommentComponent({
  comment,
  id,
  as,
  session,
  parentId,
}: CommentComponentProps) {
  const [dialog, setDialog] = useState<CommentDialogs | null>(null);
  const [isShowingReplies, setIsShowingReplies] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const renderDialogs = () => {
    const dialogProps = {
      open: true,
      onClose: () => setDialog(null),
    };
    switch (dialog) {
      case CommentDialogs.DELETE:
        return <DeleteCommentDialog id={comment.id} {...dialogProps} />;
    }
  };

  const handleChangeDialog = (dialog: CommentDialogs) => () => {
    setDialog(dialog);
  };

  const handleToggleShowReplies = () => {
    setIsShowingReplies((prev) => !prev);
  };

  return (
    <>
      {renderDialogs()}
      <div className=" flex w-full justify-between">
        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full gap-2">
            <Avatar size="sm" src={comment.createdBy.image ?? ""} />
            <div className="flex w-full flex-col">
              <div className="group">
                <div className="flex items-center gap-2">
                  <Typography variant="h6">
                    @{comment.createdBy.name}
                  </Typography>
                  <Typography variant="small">
                    {getDateString(comment.createdAt)}
                  </Typography>
                </div>
                <div className=" flex w-full items-center justify-between">
                  <Typography variant="paragraph">{comment.text}</Typography>
                  {session?.user.id === comment.createdBy.id && (
                    <DropDown placement="bottom-start">
                      <DropDownHandler>
                        <div className="opacity-0 group-hover:opacity-100">
                          <IconButton variant="text">
                            <HiOutlineDotsVertical className="rotate-90 cursor-pointer text-2xl " />
                          </IconButton>
                        </div>
                      </DropDownHandler>
                      <DropDownContent>
                        <DropDownOption
                          onClick={handleChangeDialog(CommentDialogs.DELETE)}
                          icon={MdDelete}
                        >
                          Delete
                        </DropDownOption>
                        <DropDownOption icon={FaEdit}>Edit</DropDownOption>
                      </DropDownContent>
                    </DropDown>
                  )}
                </div>
                {comment.reactions.length > 0 && (
                  <div className="my-1">
                    <CommentReactions
                      commentId={comment.id}
                      session={session}
                      reactions={comment.reactions}
                    />
                  </div>
                )}

                <div className="flex w-full items-center gap-2">
                  <ReactionButton commentId={comment.id} />

                  <Typography
                    onClick={() => setIsReplying(true)}
                    className="cursor-pointer"
                    variant="h6"
                  >
                    Reply
                  </Typography>
                </div>
              </div>
              {isReplying && (
                <div className="mt-2">
                  <AddComment
                    avatar={session?.user.image ?? ""}
                    onCancel={() => setIsReplying(false)}
                    parent={{
                      id: parentId ?? comment.id,
                      username: comment.createdBy.name ?? "",
                    }}
                    as={as}
                    id={id}
                  />
                </div>
              )}
              <div>
                {!Boolean(parentId) && comment.replies.length > 0 && (
                  <Button
                    size="sm"
                    className="mb-2 rounded-full"
                    variant="text"
                    color="indigo"
                    onClick={handleToggleShowReplies}
                  >
                    <div className="flex items-center gap-2">
                      <VscTriangleDown
                        className={isShowingReplies && "rotate-180"}
                        size="20"
                      />
                      <Typography variant="h6">
                        {comment.replies.length} Replies
                      </Typography>
                    </div>
                  </Button>
                )}

                {isShowingReplies && (
                  <div className="flex w-full flex-col gap-4">
                    {comment.replies.map((reply) => (
                      <CommentComponent
                        session={session}
                        key={reply.id}
                        comment={reply}
                        id={id}
                        as={as}
                        parentId={parentId ?? comment.id}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
