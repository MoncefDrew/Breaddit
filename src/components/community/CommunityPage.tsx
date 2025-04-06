"use client";

import CommunityHeader from "./CommunityHeader";
import CommunityTabs from "@/components/community/CommunityTabs";

import CommunityAboutCard from "./CommunityAboutCard";

interface Rule {
  id: string;
  title: string;
  description: string;
}

interface CommunityPageProps {
  community: {
    id: string;
    name: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
    creatorId: string;
    coverImage?: string | null;
    profileImage?: string | null;
  };
  memberCount: number;
  isSubscribed: boolean;
  isModerator: boolean;
  initialPosts: any[];
  session: any | null;
  rules: Rule[];
}

const CommunityPage = ({
  community,
  memberCount,
  isSubscribed,
  isModerator,
  initialPosts = [],
  session,
  rules,
}: CommunityPageProps) => {
  // We don't need to manage description state here anymore
  // since it's handled in the layout

  return (
    <div className="text-primary pb-3 ">
      <CommunityHeader
        id={community.id}
        name={community.name}
        isSubscribed={isSubscribed}
        isModerator={isModerator}
        coverImage={community.coverImage}
        profileImage={community.profileImage}
      />

      <div className="max-w-5xl mx-auto ">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main content column */}
          <div className="md:col-span-2">
            <CommunityTabs
              session={session}
              communityName={community.name}
              initialPosts={initialPosts}
            />
          </div>

          {/* Sidebar column */}
          <div className="md:col-span-1">
          <CommunityAboutCard
          community={{
            id: community.id,
            name: community.name,
            createdAt: community.createdAt,
            creatorId: community.creatorId ?? "creator",
          }}
          memberCount={memberCount}
          description={community.description || null}
          profileImage={community.profileImage}
          isSubscribed={isSubscribed}
          isModerator={isModerator}
          rules={rules}
        />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
