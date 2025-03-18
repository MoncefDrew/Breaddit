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
    <div className="rounded-md bg-surface mb-4">
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
          className="flex-1 text-sm bg-surface-dark border border-custom px-4 py-2 rounded-full text-primary cursor-pointer hover:bg-surface-dark-hover transition"
        >
          Create a post
        </div>

        {/* Image Button */}
        <button
          onClick={() => router.push(pathname + "/submit")}
          className="p-2 rounded-full hover:bg-[#343536] transition"
        >
          <ImageIcon className="h-5 w-5 text-muted hover:text-primary" />
        </button>

        {/* Link Button */}
        <button
          onClick={() => router.push(pathname + "/submit")}
          className="p-2 rounded-full hover:bg-[#343536] transition"
        >
          <Link2 className="h-5 w-5 text-muted hover:text-primary" />
        </button>
      </div>
    </div>
  );
};

export default MiniCreatePost;
