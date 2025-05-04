import { Editor } from "@/components/Editor";
// Assuming Button is already styled appropriately or we won't use it directly here
// import { Button } from "@/components/ui/Button";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { AlertCircle } from "lucide-react"; // Removed unused icons
import ToFeedButton from "@/components/ToFeedButton";
import CommunityAboutCard from "@/components/community/CommunityAboutCard";
import { getAuthSession } from "@/lib/auth";
import UserAvatar from "@/components/UserAvatar";
import CommunityRules from "@/components/community/CommunityRules";

interface pageProps {
  params: {
    slug: string;
  };
}

const Page = async ({ params }: pageProps) => {
  // Renamed component to Page (PascalCase)
  const session = await getAuthSession();

  // Authentication check remains the same
  if (!session?.user) {
    // Consider redirecting to sign-in instead of just notFound
    return notFound();
  }

  // Database fetching remains the same
  const subreddit = await db.subreddit.findFirst({
    where: {
      name: params.slug,
      // Removed creatorId check here as posts can be made by others
      // creatorId: { not: null },
    },
    include: {
      subscribers: true,
      // posts: { // Posts aren't directly used on this page
      //   take: 1,
      //   orderBy: {
      //     createdAt: "desc",
      //   },
      // },
      rules: true, // Keep rules for the sidebar
    },
  });

  if (!subreddit) return notFound();

  // Subscription and moderator status calculation remains the same
  const isSubscribed = subreddit.subscribers.some(
    // Use .some for efficiency
    (sub) => sub.userId === session.user.id
  );

  const isModerator = session.user.id === subreddit.creatorId;

  // Type assertion for CommunityAboutCard props
  const typedCommunity = {
    id: subreddit.id,
    name: subreddit.name,
    createdAt: subreddit.createdAt,
    creatorId: subreddit.creatorId as string | null,
    description: subreddit.description, 
  };

  return (
    <div className=" min-h-screen pt-10 ">
      <div className="max-w-5xl mx-auto text-zinc-100 pb-10">
        {/* Two-column layout */}
        <div className="flex flex-col md:flex-row gap-x-6 gap-y-4">
          {/* Optional: Back navigation - Style appropriately if kept */}
          <div>
            <ToFeedButton />
          </div>
          {/* Left column - Editor section */}
          <div className="flex-1 order-2 md:order-1">
            <Editor subredditId={subreddit.id} />
          </div>

          {/* Right column - Sidebar */}
          <div className="w-full md:w-80 order-1 md:order-2">
            <div className="sticky top-16 space-y-4">
              {/* Community Info Card */}
              <CommunityAboutCard
                community={typedCommunity}
                memberCount={subreddit.subscribers.length}
                isSubscribed={isSubscribed}
                isModerator={isModerator}
                isLoggedIn={!!session?.user}
                // description={subreddit.description}
              />
              {/* Community Rules Card */}
              {/* ASSUMPTION: CommunityRules is styled internally for dark theme */}
              {subreddit.rules.length > 0 && ( // Conditionally render if rules exist
                <CommunityRules
                  communityName={params.slug}
                  rules={subreddit.rules}
                  isModerator={isModerator}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page; // Use PascalCase for component name
