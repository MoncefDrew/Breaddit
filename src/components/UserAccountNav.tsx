"use client";
import { FC } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuPortal,
} from "./ui/DropDownMenu";
import UserAvatar from "./UserAvatar";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { 
  User, 
  Home, 
  Plus, 
  Settings, 
  LogOut 
} from "lucide-react";

interface UserAccountNavProps {
  user: {
    name?: string | null;
    image?: string | null;
    email?: string | null;
    id: string;
    username?: string;
  };
}

const UserAccountNav: FC<UserAccountNavProps> = ({ user }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <UserAvatar
          className="h-9 w-9 border-2 rounded-full border-zinc-500"
          user={{
            name: user.name || null,
            image: user.image || null,
          }}
        />
      </DropdownMenuTrigger>

      <DropdownMenuPortal>
        <DropdownMenuContent
          className="bg-[#13171a] border border-custom z-50"
          align="end"
          sideOffset={5}
        >
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              {user.name && (
                <p className="font-medium text-primary">{user.name}</p>
              )}
              {user.email && (
                <p className="w-[200px] truncate text-sm text-muted">
                  {user.email}
                </p>
              )}
            </div>
          </div>

          <DropdownMenuSeparator className="bg-[#343536]" />

          <DropdownMenuItem
            asChild
            className="focus:bg-surface-dark focus:text-primary"
          >
            <Link
              href={`/u/${user.username}`}
              className="text-primary hover:text-white flex items-center gap-2"
            >
              <User className="h-4 w-4 text-muted" />
              My Profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            asChild
            className="focus:bg-surface-dark focus:text-primary"
          >
            <Link href="/" className="text-primary hover:text-white flex items-center gap-2">
              <Home className="h-4 w-4 text-muted" />
              Feed
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            asChild
            className="focus:bg-surface-dark focus:text-primary"
          >
            <Link href="/r/create" className="text-primary hover:text-white flex items-center gap-2">
              <Plus className="h-4 w-4 text-muted" />
              Create Community
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            asChild
            className="focus:bg-surface-dark focus:text-primary"
          >
            <Link href="/settings" className="text-primary hover:text-white flex items-center gap-2">
              <Settings className="h-4 w-4 text-muted" />
              Settings
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-[#343536]" />

          <DropdownMenuItem
            onClick={() => {
              signOut({ callbackUrl: `${window.location.origin}/sign-in` });
            }}
            className="cursor-pointer text-primary hover:text-white focus:bg-surface-dark focus:text-primary flex items-center gap-2"
          >
            <LogOut className="h-4 w-4 text-muted" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
};

export default UserAccountNav;