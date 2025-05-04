"use client";

import { FC, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

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
      toast({ 
        title: "Post deleted", 
        description: "Your post has been successfully deleted",
        variant: "default" 
      });
      router.back();
    },
    onError: (error: AxiosError) => {
      toast({
        title: "Unable to delete post",
        description: error.response?.statusText || "An error occurred",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setClicked(false);
    },
  });

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      setClicked(true);
      deletePost.mutate();
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1.5 transition-colors"
      disabled={deletePost.isLoading}
    >
      <Trash2 className="h-4 w-4" />
      <span>{deletePost.isLoading ? "Deleting..." : "Delete"}</span>
    </button>
  );
};

export default DeletePostButton;
