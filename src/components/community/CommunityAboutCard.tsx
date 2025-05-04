"use client";

import { FC, useState } from "react";
import { format } from "date-fns";
import {
  ChevronDown,
  Cake,
  Edit,
  Users,
  Bell,
  Shield,
  Check,
  LogOut
} from "lucide-react";
import { Button } from "../ui/Button";
import { Textarea } from "../ui/textarea";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
    creatorId: string | null;
    description: string | null;
  };
  memberCount: number;
  onlineCount?: number;
  profileImage?: string | null;
  isSubscribed: boolean;
  isModerator: boolean;
  onbioUpdate?: (newDescription: string) => void;
  rules?: Rule[];
  user?: string | null | undefined;
  isLoggedIn?: any;
}

const CommunityAboutCard: FC<CommunityAboutCardProps> = ({
  community,
  memberCount,
  isSubscribed,
  isModerator,
  onbioUpdate,
  rules = [],
  user,
  isLoggedIn,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [descriptionText, setDescriptionText] = useState(
    community.description || ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const [expandedRules, setExpandedRules] = useState<string[]>([]);
  const { toast } = useToast();
  const router = useRouter();

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

  const toggleRuleExpansion = (ruleId: string) => {
    setExpandedRules(prev => 
      prev.includes(ruleId) 
        ? prev.filter(id => id !== ruleId)
        : [...prev, ruleId]
    );
  };

  // Handle subscription toggle
  const handleJoinToggle = async () => {
    if (!user) {
      router.push('/sign-in');
      return;
    }
    
    setIsLoading(true);
    try {
      const endpoint = isSubscribed ? '/api/subreddit/unsubscribe' : '/api/subreddit/subscribe';
      const response = await axios.post(endpoint, {
        subredditId: community.id,
      });

      if (response.status === 200) {
        toast({
          title: isSubscribed ? "Unsubscribed" : "Subscribed",
          description: isSubscribed 
            ? `You have left r/${community.name}`
            : `You have joined r/${community.name}`,
          variant: "default",
        });
        
        router.refresh();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  //To implement later
  const handleModTools = () => {
    router.push(`/r/${community.name}/mod`);
  };

  return (
    <div className="rounded-md border border-gray-300 overflow-hidden">
      <div className="px-4 py-3 bg-gray-100">
        <h3 className="text-sm font-medium">About r/{community.name}</h3>
      </div>
      
      {/* Welcome Section */}
      <div className="p-4 space-y-3">

        {/* Editable Description */}
        <div className="text-sm text-gray-700">
          {isEditing ? (
            <Textarea
              value={descriptionText}
              onChange={(e) => setDescriptionText(e.target.value)}
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            />
          ) : (
            <p>{community.description || "No description available."}</p>
          )}
        </div>

        {isModerator && !isEditing && (
          <div className="mt-2 flex items-center gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900"
            >
              <Edit className="h-3.5 w-3.5" />
              <span>Edit Description</span>
            </button>
          </div>
        )}

        {isEditing && (
          <div className="flex gap-2 mt-3">
            <Button
              onClick={handleSaveDescription}
              disabled={isLoading}
              variant="primary"
              size="default"
              isLoading={isLoading}
            >
              Save
            </Button>
            <Button
              onClick={() => setIsEditing(false)}
              variant="subtle"
              size="default"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Stats section */}
      <div className="px-4 py-3 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-md font-medium text-gray-900">{memberCount.toLocaleString()}</span>
            <span className="text-xs text-gray-500">Members</span>
          </div>
          
          <div className="flex flex-col items-center">
            <span className="text-md font-medium text-gray-900">1</span>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 bg-green-500 rounded-full"></span>
              <span className="text-xs text-gray-500">Online</span>
            </div>
          </div>
          
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-800">Top 1%</span>
            <span className="text-xs text-gray-500">of communities</span>
          </div>
        </div>
      </div>

      {/* Created date */}
      <div className="px-4 py-3 border-t border-gray-200">
        <div className="flex items-center text-sm text-gray-600">
          <Cake className="h-4 w-4 mr-2 text-gray-500" />
          <span>Created {format(new Date(community.createdAt), "MMMM d, yyyy")}</span>
        </div>
      </div>
      
      {isModerator && (
        <div className="px-4 py-3 border-t border-gray-200">
          <div className="flex items-center text-sm text-gray-600">
            <Shield className="h-4 w-4 mr-2 text-gray-500" />
            <span>You are a moderator of this community</span>
          </div>
        </div>
      )}

      {/* Call to action buttons based on subscription status */}
        {/* Manage community (Ready to Implement) */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        {!isLoggedIn ? (
          <Link href="/sign-in" className="w-full">
            <Button 
              variant="primary"
              size="default"
              className="w-full"
            >
              Log In To Join
            </Button>
          </Link>
        ) : isModerator ? (
          <div className="flex flex-col gap-2">
            <Button 
              variant="outline"
              size="default"
              className="w-full text-gray-700 bg-white border-gray-300"
              onClick={handleModTools}
            >
              <Shield className="h-3.5 w-3.5 mr-2" />
              Manage Community
            </Button>
          </div>
        ) : isSubscribed ? (
          <div className="space-y-2">
            <div className="relative group">
              <Button 
                variant="default"
                size="default"
                className="w-full bg-gray-100 text-gray-800 border-gray-300 group-hover:hidden"
              >
                <Check className="h-3.5 w-3.5 mr-2 text-green-600" />
                Joined
              </Button>
              <Button 
                onClick={handleJoinToggle}
                variant="default"
                size="default"
                isLoading={isLoading}
                className="w-full bg-gray-100 text-red-600 border-gray-300 hidden group-hover:flex"
              >
                <LogOut className="h-3.5 w-3.5 mr-2" />
                Leave
              </Button>
            </div>
          </div>
        ) : (
          <Button 
            onClick={handleJoinToggle}
            variant="primary"
            size="default"
            isLoading={isLoading}
            className="w-full"
          >
            <Bell className="h-3.5 w-3.5 mr-2" />
            Join
          </Button>
        )}

        <Link
          href={`/r/${community.name}/submit`}
          className="block w-full"
        >
          <Button 
            variant="outline"
            size="default"
            className="w-full border-gray-300 text-gray-800 bg-white hover:bg-gray-50"
          >
            Create Post
          </Button>
        </Link>
      </div>

      {/* Rules Section */}
      {rules.length > 0 && (
        <div className="border-t border-gray-200">
          <div className="px-4 py-3 bg-gray-50">
            <h3 className="text-xs font-semibold tracking-wide uppercase text-gray-700">
              r/{community.name} Rules
            </h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {rules.map((rule, index) => (
              <div
                key={rule.id}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
              >
                <div 
                  className="flex items-center justify-between"
                  onClick={() => toggleRuleExpansion(rule.id)}
                >
                  <div className="flex items-start">
                    <span className="text-sm font-medium text-gray-700 mr-2">{index + 1}.</span>
                    <div>
                      <h4 className="text-sm font-medium text-gray-800">{rule.title}</h4>
                      {rule.description && expandedRules.includes(rule.id) && (
                        <p className="text-xs text-gray-600 mt-1">{rule.description}</p>
                      )}
                    </div>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${
                    expandedRules.includes(rule.id) ? 'rotate-180' : ''
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Communities */}
      <div className="border-t border-gray-200">
        <div className="px-4 py-3 bg-gray-50">
          <h3 className="text-xs font-semibold tracking-wide uppercase text-gray-700">
            Related Communities
          </h3>
        </div>
        
        <div className="p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500" />
            <Link href="/r/LawSchool" className="text-blue-600 hover:underline text-sm">
              r/LawSchool
            </Link>
            <span className="text-xs text-gray-500">878,799 members</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500" />
            <Link href="/r/Legal" className="text-blue-600 hover:underline text-sm">
              r/Legal
            </Link>
            <span className="text-xs text-gray-500">452,156 members</span>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
        <div className="flex justify-between text-xs text-gray-500">
          <Link href="#" className="hover:underline">Community Options</Link>
          {isModerator && (
            <Link href={`/r/${community.name}/mod`} className="hover:underline">Moderation Tools</Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityAboutCard;
