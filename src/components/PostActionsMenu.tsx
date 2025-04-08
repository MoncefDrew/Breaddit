import { MoreVertical, Trash, Pencil } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/DropDownMenu";
import DeletePostButton from "@/components/DeletePostButton";
import EditPostButton from "@/components/EditPostButton";
import { Post } from "@prisma/client";

interface PostActionsMenuProps {
  post: Post | null;
}

const PostActionsMenu = ({ post }: PostActionsMenuProps) => {
  if (!post) return null;
  
  return (
    <div className="flex justify-end mt-3">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-zinc-800">
          <MoreVertical className="h-5 w-5 text-zinc-400" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-[#1A1C1E] border-zinc-800">
          <DropdownMenuItem className="flex items-center cursor-pointer text-zinc-300 hover:text-white focus:text-white">
            <span className="sr-only">Delete post</span>
            <DeletePostButton postId={post.id} />
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center cursor-pointer text-zinc-300 hover:text-white focus:text-white">
            <span className="sr-only">Edit post</span>
            <EditPostButton post={post} />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default PostActionsMenu;