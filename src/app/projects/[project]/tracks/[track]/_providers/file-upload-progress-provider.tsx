"use client";
import { Spinner, Typography } from "@/app/_components/mtw-wrappers";
import { createContext, useContext, useState } from "react";

type FileUpload = {
  id: number | string;
  name: string;
};

export const FileUploadProgressContext = createContext<{
  files: FileUpload[];
  addFile: (file: FileUpload) => void;
  addFiles: (files: FileUpload[]) => void;
  removeFile: (id: string) => void;
}>(undefined!);

export function FileUploadProgressProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [files, setFiles] = useState<FileUpload[]>([]);

  const addFile = (file: FileUpload) => {
    setFiles((prev) => [...prev, file]);
  };

  const addFiles = (files: FileUpload[]) => {
    setFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (id: FileUpload["id"]) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  return (
    <FileUploadProgressContext.Provider
      value={{
        files,
        addFile,
        removeFile,
        addFiles,
      }}
    >
      {children}
      {Object.keys(files).length > 0 && (
        <div className="fixed bottom-0 right-0 z-[1000] m-4 flex flex-col gap-2 rounded-md bg-gradient-to-t from-indigo-50 to-white to-[5%] p-4 drop-shadow-md">
          {files.map(({ id, name }) => (
            <div key={id} className="flex items-center justify-end gap-2">
              <Typography variant="h6">{name}</Typography>
              <Spinner color="indigo" />
            </div>
          ))}
        </div>
      )}
    </FileUploadProgressContext.Provider>
  );
}

export function useFileUploadProgress() {
  return useContext(FileUploadProgressContext);
}
