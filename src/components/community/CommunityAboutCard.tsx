"use client";

import { FC, useState } from "react";
import { format } from "date-fns";
import {
  Calendar,
  Users,
  Link2,
  Globe,
  Shield,
  ChevronDown,
  Cake,
} from "lucide-react";
import { Button } from "../ui/Button";
import { Textarea } from "../ui/textarea";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import Link from "next/link";

interface Rule {
  id: string;
  title: string;
  description?: string;
}

interface CommunityAboutCardProps {
  community: {
    id: string;
    name: string;
    createdAt: Date;
    creatorId: string;
    description?: string;
    bio?: string;
  };
  memberCount: number;
  onlineCount?: number;
  description: string | null;
  profileImage?: string | null;
  isSubscribed: boolean;
  isModerator: boolean;
  onbioUpdate?: (newDescription: string) => void;
  rules?: Rule[];
}

const CommunityAboutCard: FC<CommunityAboutCardProps> = ({
  community,
  memberCount,
  onlineCount = 0,
  description,
  isModerator,
  onbioUpdate,
  rules = [],
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [descriptionText, setDescriptionText] = useState(description || "");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSaveDescription = async () => {
    if (!isModerator) return;

    setIsLoading(true);
    try {
      const response = await axios.patch(`/api/subreddit/${community.name}`, {
        description: descriptionText,
      });

      if (response.status === 200) {
        if (onbioUpdate) {
          onbioUpdate(descriptionText);
        }
        setIsEditing(false);
        toast({
          title: "Success",
          description: "Community description updated.",
          variant: "default",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update description.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#040505] rounded-md overflow-hidden">

      {/* Welcome Section */}
      <div className="p-4 space-y-3 text-[#8aa3ad]">
        <p className="text-base ">{community.name}!</p>
        <p className="text-sm ">{community.bio}</p>
        <p className="text-sm ">
          r/{community.name} is moderated more heavily than most other subs on
          reddit. Please consult the{" "}
          <Link href="/rules" className="text-[#4FBCFF] hover:underline">
            Rules
          </Link>{" "}
          before posting or commenting.
        </p>
      </div>

      {/* About Community Card */}
      <div className="p-3">

        {/* Created and Public info */}
        <div className="flex items-start flex-col gap-2 mb-4">
          <div className="flex items-start text-sm font-medium text-[#8aa3ad] ">
            <Cake className="h-4 w-4 mr-2" />
            <span>
              Created {format(new Date(community.createdAt), "MMM d, yyyy")}
            </span>
          </div>
          <div className="flex items-center text-sm font-medium text-[#8aa3ad]">
            <Globe className="h-4 w-4 mr-2" />
            <span>Public</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex gap-8 mb-2 items-end border-b pb-4 border-b-gray-500 ">
          <div className="flex items-start flex-col">
            <div className="text-[16px] font-medium text-[#D7DADC]">
              {memberCount.toLocaleString()}
            </div>
            <div className="text-xs font-medium text-[#8aa3ad]">Members</div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="text-[16px] font-medium text-[#D7DADC]">
                {onlineCount.toLocaleString()}
              </span>
            </div>
            <div className="flex flex-row items-center gap-1 text-xs font-medium text-[#8aa3ad]">
              <span className="flex h-2 w-2 bg-[#46D160] rounded-full" />
              Online
            </div>
          </div>
          <div>
            <div className="flex items-center text-sm font-medium text-[#D7DADC]">
              Top 1%
              <Link2 className="h-4 w-4 ml-1 text-[#818384]" />
            </div>
            <div className="text-sm text-[#8aa3ad]">Rank by size</div>
          </div>
        </div>
      </div>

      {/* Rules Section */}
      <div className="px-4 py-3">
        <h2 className="text-xs font-bold tracking-[0.5px] uppercase text-[#7ba1ac]">
          RULES
        </h2>
      </div>
      <div>
        {rules.map((rule, index) => (
          <div
            key={rule.id}
            className="px-4 py-2 hover:bg-[#181C1F] cursor-pointer"
          >
            <div className="flex items-baseline text">
              <span className="text-sm text-[#8aa3ad] mr-2">{index + 1}.</span>
              <div className="flex-1">
                <h3 className="text-sm text-[#8aa3ad]">{rule.title}</h3>
              </div>
              <ChevronDown className="h-4 w-4 text-[#818384] ml-2" />
            </div>
          </div>
        ))}
      </div>

      {/* Related Subreddits */}
      <div className="px-4 py-3">
        <h2 className="text-[10px] font-bold tracking-[0.5px] uppercase text-[#818384]">
          RELATED SUBREDDITS
        </h2>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-[#818384]" />
          <Link href="/r/LawSchool" className="text-[#4FBCFF] hover:underline">
            r/LawSchool
          </Link>
          <span className="text-xs text-[#818384]">878,799 members</span>
        </div>
      </div>
    </div>
  );
};

export default CommunityAboutCard;
