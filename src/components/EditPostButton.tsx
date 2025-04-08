"use client";

import { FC, useState } from "react";
import { Button } from "@/components/ui/Button";
import { EditPostEditor } from "./EditPostEditor";

interface EditPostButtonProps {
  post?: { id: string; title: string; content: any; subredditId: string };
}

const EditPostButton: FC<EditPostButtonProps> = ({ post }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsEditing(true)}
        className="text-gray-500 hover:text-gray-700  hover:underline text-sm focus:outline-none"
      >
        Edit
      </button>

      {isEditing && (
        <div className="fixed inset-0 p-4 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="w-screen max-h-screen py-4 flex flex-col 
             md:w-3/4 md:max-w-2xl md:h-auto md:rounded-lg md:shadow-lg overflow-auto"
          >
            <EditPostEditor
              initialTitle={post?.title}
              initialContent={post?.content}
              postId={post?.id}
              onSuccess={() => setIsEditing(false)}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default EditPostButton;
