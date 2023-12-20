import {
  Dialog,
  DialogBody,
  DialogHeader,
} from "@/app/_components/mtw-wrappers";
import { type DialogComponentProps } from "@/app/projects/_components/projects/project-header";
import { type FileWithMeta } from "@/utils/typing-utils/files";
import { Typography } from "@material-tailwind/react";

type DialogProps = {
  file: FileWithMeta;
};

export function GetFileInfoDialog({
  open,
  onClose,
  file,
}: DialogComponentProps<DialogProps>) {
  return (
    <Dialog open={open} handler={onClose}>
      <DialogHeader className="pb-0">File info</DialogHeader>
      <DialogBody>
        <div className="flex items-center gap-2">
          <Typography variant="h5">Name:</Typography>
          <Typography>{file.name}</Typography>
        </div>
        <div className="flex items-center gap-2">
          <Typography variant="h5">Type:</Typography>
          <Typography>{file.type}</Typography>
        </div>
        <div className="flex items-center gap-2">
          <Typography variant="h5">Size:</Typography>
          <Typography>{file.size} bytes</Typography>
        </div>
        <div className="flex items-center gap-2">
          <Typography variant="h5">Created by:</Typography>
          <Typography>{file.createdBy.name}</Typography>
        </div>
        <div className="flex items-center gap-2">
          <Typography variant="h5">Created at:</Typography>
          <Typography>
            {file.createdAt.toLocaleDateString("en-us", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
            })}
          </Typography>
        </div>
      </DialogBody>
    </Dialog>
  );
}
