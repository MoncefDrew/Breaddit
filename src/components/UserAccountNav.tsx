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
          className="h-9 w-9 border-2 rounded-full border-gray-200"
          user={{
            name: user.name || null,
            image: user.image || null,
          }}
        />
      </DropdownMenuTrigger>

      <DropdownMenuPortal>
        <DropdownMenuContent
          className="bg-white border border-gray-200 shadow-md z-50"
          align="end"
          sideOffset={5}
        >
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              {user.name && (
                <p className="font-medium text-gray-900">{user.name}</p>
              )}
              {user.email && (
                <p className="w-[200px] truncate text-sm text-gray-500">
                  {user.email}
                </p>
              )}
            </div>
          </div>

          <DropdownMenuSeparator className="bg-gray-200" />

          <DropdownMenuItem
            asChild
            className="focus:bg-gray-100 focus:text-gray-900"
          >
            <Link
              href={`/u/${user.username}`}
              className="text-gray-700 hover:text-gray-900 flex items-center gap-2"
            >
              <User className="h-4 w-4 text-gray-500" />
              My Profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            asChild
            className="focus:bg-gray-100 focus:text-gray-900"
          >
            <Link href="/" className="text-gray-700 hover:text-gray-900 flex items-center gap-2">
              <Home className="h-4 w-4 text-gray-500" />
              Feed
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            asChild
            className="focus:bg-gray-100 focus:text-gray-900"
          >
            <Link href="/r/create" className="text-gray-700 hover:text-gray-900 flex items-center gap-2">
              <Plus className="h-4 w-4 text-gray-500" />
              Create Community
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            asChild
            className="focus:bg-gray-100 focus:text-gray-900"
          >
            <Link href="/settings" className="text-gray-700 hover:text-gray-900 flex items-center gap-2">
              <Settings className="h-4 w-4 text-gray-500" />
              Settings
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-gray-200" />

          <DropdownMenuItem
            onClick={() => {
              signOut({ callbackUrl: `${window.location.origin}/sign-in` });
            }}
            className="cursor-pointer text-gray-700 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 flex items-center gap-2"
          >
            <LogOut className="h-4 w-4 text-gray-500" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
};

export default UserAccountNav;