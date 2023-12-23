import { ImagePlacehoderSkeleton } from "@/app/_components/skeletons/image-placeholder";

export default function Loading() {
  return (
    <main className="flex flex-col gap-8 p-12">
      <ImagePlacehoderSkeleton />
      <div className="h-[400px] w-full animate-pulse rounded-md bg-gray-300"></div>
    </main>
  );
}
