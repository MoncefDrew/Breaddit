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
    <>
      {/* Feed Title - Kept outside the sidebar component */}
      <h1 className="font-bold text-3xl md:text-4xl text-[#90a2ad] mt-14 px-4">
        Your feed
      </h1>

      <div className="grid grid-cols-1 px-4 max-w-6xl md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
        {/* Feed Component - Unchanged */}
        {/*@ts-expect-error server component */}
        {session ? <CustomFeed /> : <GeneralFeed />}

        {/* Subreddit info / Sidebar - STYLES TRANSFORMED BELOW */}
        <div className="overflow-hidden rounded-lg h-fit bg-[#14181b] order-first md:order-last"> {/* Changed background, removed border */}
          {/* Header like "Ireland/Eire" */}
          <div className="bg-[#1c2226] px-6 py-4"> {/* Slightly different dark bg for header */}
            {/* Using HomeIcon and "Home" text as the title */}
            <p className="font-bold text-lg flex items-center gap-2 text-gray-100"> {/* Bolder, larger text, white/light gray */}
              <HomeIcon className="w-5 h-5 text-gray-300" /> {/* Icon color adjusted */}
              Home
            </p>
            {/* You could add description text here if needed, like the image */}
            {/* <p className="text-sm text-gray-400 mt-1">Your personal Breaddit frontpage...</p> */}
          </div>

          {/* Content Area */}
          <div className="px-6 py-4 text-sm"> {/* Added base text size */}
            <div className="flex flex-col gap-4">
              {/* Description */}
              <p className="leading-6 text-gray-400"> {/* Lighter text color */}
                Your personal Breaddit frontpage. Come here to check in with
                your favorite communities.
              </p>

              {/* "Getting Started" styled like "COMMUNITY BOOKMARKS" */}
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider pt-2"> {/* Adjusted style */}
                Getting Started
              </h3>

              {/* List */}
              <ul className="space-y-1 text-gray-300"> {/* Adjusted text color and spacing */}
                {/* Simplified list items */}
                <li>Create and join communities</li>
                <li>Share and discuss interesting content</li>
                <li>Earn karma and awards</li>
              </ul>

              {/* Separator (Optional, mimicking subtle separation) */}
              {/* <div className="h-px bg-zinc-700 my-2" /> */}

              {/* Link styled like the bookmark buttons */}
              <Link
                // Using Tailwind classes directly for button styling to match the image
                className="block w-full bg-[#2a3238] hover:bg-zinc-600 text-gray-100 font-medium py-2 px-4 rounded-full text-center transition-colors duration-150 mt-2" // Button styles: dark bg, light text, rounded, full width
                href="/r/create"
              >
                Create Community
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}