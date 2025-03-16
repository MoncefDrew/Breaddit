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
    <div className="rounded-md bg-[#1A1A1B] shadow border border-[#343536] hover:border-[#4E4E50] transition-colors duration-200 mb-4">
      <div className="px-6 py-4 flex items-center gap-4">
        {/* Avatar */}
        <UserAvatar
          user={{
            name: session?.user.name || null,
            image: session?.user.image || null,
          }}
          className="h-8 w-8"
        />

        {/* Input Box (Read-only) */}
        <div
          onClick={() => router.push(pathname + "/submit")}
          className="flex-1 text-sm bg-[#272729] border border-[#343536] px-4 py-2 rounded-full text-[#D7DADC] cursor-pointer hover:bg-[#2D2D2F] transition"
        >
          Create a post
        </div>

        {/* Image Button */}
        <button
          onClick={() => router.push(pathname + "/submit")}
          className="p-2 rounded-full hover:bg-[#343536] transition"
        >
          <ImageIcon className="h-5 w-5 text-[#818384] hover:text-[#D7DADC]" />
        </button>

        {/* Link Button */}
        <button
          onClick={() => router.push(pathname + "/submit")}
          className="p-2 rounded-full hover:bg-[#343536] transition"
        >
          <Link2 className="h-5 w-5 text-[#818384] hover:text-[#D7DADC]" />
        </button>
      </div>
    </div>
  );
};

export default MiniCreatePost;
