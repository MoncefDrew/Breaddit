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
  user:string | null | undefined;
}

const CommunityPage = ({
  community,
  memberCount,
  isSubscribed,
  isModerator,
  initialPosts = [],
  session,
  rules,
  user,
}: CommunityPageProps) => {

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
            description: community.description
          }}
          memberCount={memberCount}
          profileImage={community.profileImage}
          isSubscribed={isSubscribed}
          isModerator={isModerator}
          rules={rules}
          user={user}
        />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
