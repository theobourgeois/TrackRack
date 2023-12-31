"use client";
import { Button } from "@/app/_components/mtw-wrappers";
import { useSnackBar } from "@/app/_providers/snackbar-provider";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { IoPersonAddOutline, IoPersonRemoveOutline } from "react-icons/io5";

type FollowButtonProps = {
  isFollowing: boolean;
  userId: string;
  isAuthenticated: boolean; // used to redirect to signin page
};

export function FollowButton({
  isFollowing,
  userId,
  isAuthenticated,
}: FollowButtonProps) {
  const router = useRouter();
  const { showErrorNotification } = useSnackBar();
  const follow = api.users.follow.useMutation({
    onSuccess: () => {
      router.refresh();
    },
    onError: (error) => {
      console.error("Error following user:", error);
      showErrorNotification("Error following user. Please try again.");
    },
  });

  const handleFollow = () => {
    if (!isAuthenticated) {
      router.push("/auth/signin");
      return;
    }
    follow.mutate({
      userId,
    });
  };

  return (
    <Button
      size="sm"
      onClick={handleFollow}
      variant={isFollowing ? "outlined" : "gradient"}
      disabled={follow.isLoading}
      color="indigo"
      className="flex items-center gap-2"
    >
      {isFollowing ? (
        <IoPersonRemoveOutline size="20" />
      ) : (
        <IoPersonAddOutline size="20" />
      )}
      {isFollowing ? "Following" : "Follow"}
    </Button>
  );
}
