"use client";

import { Session } from "next-auth";
import { usePathname, useRouter } from "next/navigation";
import { FC } from "react";
import UserAvatar from "./UserAvatar";
import { ImageIcon, Link2 } from "lucide-react";

interface MiniCreatePostProps {
  session: Session | null;
}

const MiniCreatePost: FC<MiniCreatePostProps> = ({ session }) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="rounded-md bg-white border border-gray-300">
      <div className="flex items-center p-2 gap-2">
        {/* Avatar */}
        <UserAvatar
          user={{
            name: session?.user.name || null,
            image: session?.user.image || null,
          }}
          className="h-8 w-8"
        />

        {/* Input Box */}
        <div
          onClick={() => router.push(pathname + "/submit")}
          className="flex-1 text-sm bg-gray-100 border border-gray-200 px-4 py-2 rounded-full text-gray-500 cursor-pointer hover:bg-gray-200 transition"
        >
          Create a post
        </div>

        {/* Image Button */}
        <button
          onClick={() => router.push(pathname + "/submit")}
          className="p-2 rounded-full hover:bg-gray-100 transition text-gray-500"
          aria-label="Create image post"
        >
          <ImageIcon className="h-5 w-5" />
        </button>

        {/* Link Button */}
        <button
          onClick={() => router.push(pathname + "/submit")}
          className="p-2 rounded-full hover:bg-gray-100 transition text-gray-500"
          aria-label="Create link post"
        >
          <Link2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default MiniCreatePost;
