"use client";

import { FC, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";

interface DeletePostButtonProps {
  postId?: string;
}

const DeletePostButton: FC<DeletePostButtonProps> = ({ postId }) => {
  const router = useRouter();
  const [clicked, setClicked] = useState(false);

  const deletePost = useMutation({
    mutationFn: async () => {
      if (!postId) throw new Error("Post ID is missing");

      await axios.post(`/api/subreddit/post/delete`, { postId });
    },
    onSuccess: () => {
      toast({ title: "Post deleted successfully", variant: "default" });
      router.back();
    },
    onError: (error: AxiosError) => {
      toast({
        title: "You cannot delete that post",
        description: error.response?.statusText || "An error occurred",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setClicked(false);
    },
  });

  return (
    <button
      onClick={() => {
        if (confirm("Are you sure you want to delete this post?")) {
          setClicked(true);
          deletePost.mutate();
        }
      }}
      className="text-red-500 hover:underline text-sm focus:outline-none"
      disabled={deletePost.isLoading}
    >
      {deletePost.isLoading ? "Deleting..." : "Delete"}
    </button>
  );
};

export default DeletePostButton;
