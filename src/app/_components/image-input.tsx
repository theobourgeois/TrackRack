"use client";
import { useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { twMerge } from "tailwind-merge";
import { useSnackBar } from "../_providers/snackbar-provider";
import Image from "next/image";

export const IMAGE_FORMATS = [
  "image/apng",
  "image/avif",
  "image/jpeg",
  "image/png",
  "image/svg+xml",
  "image/webp",
];

interface ImageInputProps {
  defaultImage?: string;
  name: string;
  sizeStyles?: string;
  onChange?: (image: File) => void;
  maxSize?: number; // file size in mb
}
export function ImageInput({
  defaultImage,
  name,
  sizeStyles = "w-64 h-64",
  onChange,
  maxSize = 4,
}: ImageInputProps) {
  const [image, setImage] = useState<string>(defaultImage ?? "");
  const { showErrorNotification } = useSnackBar();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSizeInBytes = maxSize * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        showErrorNotification(`File is more than ${maxSize}mb`);
        return;
      }

      onChange?.(file);
      const fileReader = new FileReader();
      fileReader.onload = () => {
        if (IMAGE_FORMATS.includes(file.type)) {
          return setImage(fileReader.result as string);
        }
        return showErrorNotification("Incorrect file type");
      };
      fileReader.readAsDataURL(file);
    }
  };
  return (
    <div className="relative rounded-lg">
      {image ? (
        <Image
          src={image}
          width={100}
          height={100}
          alt="Image preview"
          className={twMerge(
            sizeStyles,
            "rounded-lg bg-indigo-500 object-cover drop-shadow-md",
          )}
        />
      ) : (
        <div className={twMerge(sizeStyles, "rounded-lg bg-indigo-500")}></div>
      )}
      <div
        className={twMerge(
          sizeStyles,
          "absolute top-0 z-[100] flex items-center justify-center rounded-lg opacity-0 hover:bg-black hover:bg-opacity-30 hover:opacity-100",
        )}
      >
        <FiEdit2 className="text-4xl text-white" />
        <input
          type="file"
          name={name}
          accept="image/*"
          className={twMerge(
            sizeStyles,
            "absolute top-0 h-full w-full cursor-pointer opacity-0",
          )}
          onChange={handleChange}
        ></input>
      </div>
    </div>
  );
}
