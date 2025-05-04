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
  user: string | null | undefined;
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
    <div className="min-h-screen bg-white">
      {/* Community Header */}
      <CommunityHeader
        id={community.id}
        name={community.name}
        isSubscribed={isSubscribed}
        isModerator={isModerator}
        coverImage={community.coverImage}
        profileImage={community.profileImage}
      />

      {/* Main content area with correct spacing */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-6 mt-2">
          {/* Left section with tabs - adjusted width */}
          <div className="md:w-2/3">
            <CommunityTabs
              session={session}
              communityName={community.name}
              initialPosts={initialPosts}
            />
          </div>

          {/* Right sidebar - adjusted width */}
          <div className="md:w-1/3">
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
              isLoggedIn={!!session?.user}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
