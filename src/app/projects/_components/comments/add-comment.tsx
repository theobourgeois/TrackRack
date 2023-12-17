"use client";
import {
  Avatar,
  Button,
  Spinner,
  Textarea,
} from "@/app/_components/mtw-wrappers";
import { useSnackBar } from "@/app/_providers/snackbar-provider";
import { getNewId } from "@/utils/misc-utils";
import { CommentType } from "@/utils/typing-utils/comments";
import { api } from "@/trpc/react";
import { TextareaProps } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

function AutoResizeTextarea(props: Omit<TextareaProps, "ref">) {
  const textareaId = getNewId();

  // Auto resize textarea. ref on text area not working, that's why we use id
  useEffect(() => {
    const textarea = document.getElementById(
      "comment-textarea-" + textareaId,
    ) as HTMLTextAreaElement;
    if (!textarea) return;
    if (!props.value) return;
    const val = props.value as string;
    if (Boolean(parent)) {
      textarea.focus();
      textarea.setSelectionRange(val.length, val.length);
    }
    textarea.style.height = "auto"; // Reset height to allow shrink
    textarea.style.height = `${textarea.scrollHeight}px`; // Set to scrollHeight
  }, [props.value]);

  return (
    <Textarea
      {...props}
      id={"comment-textarea-" + textareaId}
      className={twMerge("!min-h-[auto]", props.className)}
    />
  );
}

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
  const { showErrorNotification } = useSnackBar();
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
    onError: () => {
      showErrorNotification("Something went wrong, please try again.");
    },
  });

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
      entityId: id,
      text: comment,
      parentId: parent?.id,
    });
  };
  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex w-full gap-2">
        <Avatar size="sm" src={avatar} />
        <AutoResizeTextarea
          autoFocus={Boolean(parent)}
          onChange={handleChange}
          value={comment}
          onFocus={handleFocus}
          label={"Add a comment"}
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
            variant="gradient"
          >
            {isLoading ? <Spinner color="indigo" /> : "Comment"}
          </Button>
        </div>
      )}
    </div>
  );
}

interface EditComment {
  id: string;
  onCancel: () => void;
  comment: string;
}
export function EditComment({ id, onCancel, comment }: EditComment) {
  const { showErrorNotification } = useSnackBar();
  const router = useRouter();
  const [text, setText] = useState(comment);
  const { mutate, isLoading } = api.comments.update.useMutation({
    onSuccess: () => {
      router.refresh();
      onCancel();
    },
    onError: () => {
      showErrorNotification("Something went wrong, please try again.");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleSubmit = () => {
    mutate({
      id,
      text,
    });
  };

  return (
    <div className="mt-2 flex flex-col items-end gap-2">
      <div className="flex w-full gap-2">
        <AutoResizeTextarea
          autoFocus
          onChange={handleChange}
          value={text}
          label={"Edit comment"}
        />
      </div>

      <div className="flex flex-shrink-0 gap-2">
        <Button size="sm" onClick={onCancel} variant="outlined">
          Cancel
        </Button>
        <Button
          disabled={text === "" || isLoading}
          onClick={handleSubmit}
          size="sm"
          variant="gradient"
          color="indigo"
        >
          {isLoading ? <Spinner color="indigo" /> : "Save"}
        </Button>
      </div>
    </div>
  );
}
