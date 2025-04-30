import GeneralFeed from "@/components/GeneralFeed";
import { buttonVariants } from "@/components/ui/Button"; // Assuming this provides base button styles we might override
import { getAuthSession } from "@/lib/auth";
import { HomeIcon } from "lucide-react"; // Kept the icon, can be removed if not desired
import Link from "next/link";
import CustomFeed from "@/components/CustomFeed";

export default async function Home() {
  const session = await getAuthSession();

  // --- Style Transformation Notes ---
  // - Main container: Dark background (e.g., bg-zinc-900), rounded corners.
  // - Header section: Similar dark background, larger text.
  // - Content section: Lighter text on dark background.
  // - "Getting Started" header: Styled like "COMMUNITY BOOKMARKS".
  // - List items: Simple text, no prominent bullets.
  // - Button/Link: Styled like the dark, rounded buttons in the image.

  return (
    <div className="bg-[#0E1113] mx-auto max-w-7xl px-4">
      {/* Feed Title - Kept outside the sidebar component */}
      <h1 className="font-bold text-3xl md:text-4xl text-[#90a2ad] mt-14 px-4">
        Your feed
      </h1>

      <div className="grid grid-cols-1 px-4 md:grid-cols-3 gap-y-4 md:gap-x-4 md:gap-y-6 py-6 ">
        {/* Feed Component - Now spans 2 columns on desktop */}
        <div className="md:col-span-2"> 
          {/*@ts-expect-error server component */}
          {session ? <CustomFeed /> : <GeneralFeed />}
        </div>

        {/* Subreddit info / Sidebar - Now with modern styling */}
        <div className="overflow-hidden h-fit rounded-lg bg-[#14181b] order-first md:order-last sticky top-20 self-start">
          {/* Header like modern Reddit */}
          <div className="bg-[#1c2226] px-6 py-4 border-b border-[#2a3238]">
            <p className="font-bold text-lg flex items-center gap-2 text-gray-100">
              <HomeIcon className="w-5 h-5 text-gray-300" />
              Home
            </p>
          </div>

          {/* Content Area */}
          <div className="px-6 py-4 text-sm">
            <div className="flex flex-col gap-4">
              {/* Description with improved styling */}
              <p className="leading-6 text-gray-400 border-b border-[#2a3238] pb-4">
                Your personal Breaddit frontpage. Come here to check in with
                your favorite communities.
              </p>

              {/* "Getting Started" with modern styling */}
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Getting Started
              </h3>

              {/* List with improved styling */}
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#2a3238] flex items-center justify-center text-xs">1</div>
                  <span>Create and join communities</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#2a3238] flex items-center justify-center text-xs">2</div>
                  <span>Share and discuss interesting content</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#2a3238] flex items-center justify-center text-xs">3</div>
                  <span>Earn karma and awards</span>
                </li>
              </ul>

              {/* Updated button styling */}
              <Link
                className="block w-full bg-[#2a3238] hover:bg-[#364249] text-gray-100 font-medium py-2.5 px-4 rounded-full text-center transition-colors duration-150 mt-2 border border-[#3d4a54]"
                href="/r/create"
              >
                Create Community
              </Link>
            </div>
          </div>
          
          {/* Premium section - like Reddit */}
          <div className="px-6 py-4 bg-[#1c2226] mt-3 border-t border-[#2a3238]">
            <div className="flex flex-col gap-3">
              <h3 className="font-medium text-sm text-gray-200">Reddit Premium</h3>
              <p className="text-xs text-gray-400">The best Reddit experience, with monthly coins</p>
              <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium py-2 px-4 rounded-full text-sm">
                Try Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}