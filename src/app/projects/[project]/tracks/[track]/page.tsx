"use client";
import { UploadDropzone } from "@/utils/uploadthing";

export default function Home({
  params,
}: {
  params: { project: string; track: string };
}) {
  return <UploadDropzone endpoint="imageUploader" />;
}
