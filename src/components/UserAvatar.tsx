import { User } from "next-auth";
import { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import { AvatarProps } from "@radix-ui/react-avatar";
import { Icons } from "./Icons";

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, "name" | "image">;
}

const UserAvatar: FC<UserAvatarProps> = ({ user, ...props }) => {
  return (
    <Avatar className="border border-custom ring-1 ring-custom" {...props}>
      {user.image ? (
        <AvatarImage 
          src={user.image}
          alt={`${user.name || 'User'}'s profile picture`}
          referrerPolicy="no-referrer"
        />
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user?.name}</span>
          <Icons.user className="h-4 w-4"/>
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default UserAvatar;
