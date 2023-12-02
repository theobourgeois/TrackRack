"use client";
import {
  Avatar,
  Button,
  Spinner,
  Textarea,
} from "@/app/_components/mtw-wrappers";
import { getNewID } from "@/app/_utils/misc-utils";
import { CommentType } from "@/app/_utils/typing-utils/comments";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type AddCommentProps = {
  id: string;
  as: CommentType;
  avatar: string;
  onCancel?: (comment?: string) => void;
  parent?: {
    id: string;
    username: string;
  };
};

export function AddComment({
  id,
  as,
  avatar,
  onCancel,
  parent,
}: AddCommentProps) {
  const textareaId = getNewID();
  const [comment, setComment] = useState(
    Boolean(parent) ? `@${parent?.username} ` : "",
  );
  const [isCommenting, setIsCommenting] = useState(false);
  const router = useRouter();
  const { mutate, isLoading } = api.comments.create.useMutation({
    onSuccess: () => {
      setComment("");
      setIsCommenting(false);
      onCancel?.(comment);
      router.refresh();
    },
  });

  // Auto resize textarea. ref on text area not working, that's why we use id
  useEffect(() => {
    const textarea = document.getElementById(
      "comment-textarea-" + textareaId,
    ) as HTMLTextAreaElement;
    if (!textarea) return;
    if (Boolean(parent)) {
      textarea.focus();
      textarea.setSelectionRange(comment.length, comment.length);
    }
    textarea.style.height = "auto"; // Reset height to allow shrink
    textarea.style.height = `${textarea.scrollHeight}px`; // Set to scrollHeight
  }, [comment]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleFocus = () => {
    setIsCommenting(true);
  };

  const handleCancel = () => {
    setComment("");
    onCancel?.(comment);
    setIsCommenting(false);
  };

  const handleSubmit = () => {
    mutate({
      as,
      id,
      text: comment,
      parentId: parent?.id,
    });
  };
  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex w-full gap-2">
        <Avatar size="sm" src={avatar} />
        <Textarea
          autoFocus={Boolean(parent)}
          id={"comment-textarea-" + textareaId}
          className="!min-h-[auto]"
          onChange={handleChange}
          value={comment}
          onFocus={handleFocus}
          label="Add a comment"
        />
      </div>
      {(isCommenting || Boolean(parent)) && (
        <div className="flex flex-shrink-0 gap-2">
          <Button size="sm" onClick={handleCancel} variant="outlined">
            Cancel
          </Button>
          <Button
            disabled={comment === "" || isLoading}
            onClick={handleSubmit}
            size="sm"
            color="indigo"
          >
            {isLoading ? <Spinner color="indigo" /> : "Comment"}
          </Button>
        </div>
      )}
    </div>
  );
}
