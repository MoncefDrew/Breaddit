"use client";

import { FC, useState } from "react";
import { Button } from "@/components/ui/Button";
import { EditPostEditor } from "./EditPostEditor";
import { PencilLine } from "lucide-react";

interface EditPostButtonProps {
  post?: { id: string; title: string; content: any; subredditId: string };
}

const EditPostButton: FC<EditPostButtonProps> = ({ post }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsEditing(true)}
        className="text-gray-600 hover:text-blue-600 text-sm font-medium flex items-center gap-1.5 transition-colors"
      >
        <PencilLine className="h-4 w-4" />
        <span>Edit</span>
      </button>

      {isEditing && (
        <div className="fixed inset-0 p-4 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            className="w-screen max-h-screen py-4 flex flex-col 
             md:w-3/4 md:max-w-2xl md:h-auto md:rounded-lg md:shadow-lg overflow-auto bg-white"
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
