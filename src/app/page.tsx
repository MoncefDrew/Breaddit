import GeneralFeed from "@/components/GeneralFeed";
import { getAuthSession } from "@/lib/auth";
import { HomeIcon } from "lucide-react";
import Link from "next/link";
import CustomFeed from "@/components/CustomFeed";

export default async function Home() {
  const session = await getAuthSession();

  return (
    <div className="bg-gray-50 mx-auto max-w-7xl">
      {/* Feed Title */}
      <h1 className="font-bold text-3xl md:text-4xl text-gray-800 mt-7 ">
        Your feed
      </h1>

      <div className="grid grid-cols-1 px-4 md:px-0 md:grid-cols-3 gap-y-4 md:gap-x-4 md:gap-y-6 py-6">
        {/* Feed Component - Spans 2 columns on desktop */}
        <div className="md:col-span-2">
          {/*@ts-expect-error server component */}
          {session ? <CustomFeed /> : <GeneralFeed />}
        </div>

        {/* Subreddit info / Sidebar - Simplified colors */}
        <div className="overflow-hidden h-fit rounded-lg bg-white shadow-sm order-first md:order-last sticky top-20 self-start border border-gray-200">
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <p className="font-bold text-lg flex items-center gap-2 text-gray-800">
              <HomeIcon className="w-5 h-5 text-gray-500" />
              Home
            </p>
          </div>

          {/* Content Area */}
          <div className="px-6 py-4 text-sm">
            <div className="flex flex-col gap-4">
              {/* Description */}
              <p className="leading-6 text-gray-500 border-b border-gray-200 pb-4">
                Your personal Breaddit frontpage. Come here to check in with
                your favorite communities.
              </p>

              {/* "Getting Started" */}
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Getting Started
              </h3>

              {/* List with improved styling */}
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                    1
                  </div>
                  <span>Create and join communities</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                    2
                  </div>
                  <span>Share and discuss interesting content</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                    3
                  </div>
                  <span>Earn karma and awards</span>
                </li>
              </ul>

              {/* Create Community button - Simple neutral version */}
              <Link
                className="block w-full border border-gray-300 text-gray-800 py-1.5 px-3 rounded-md text-xs text-center hover:bg-gray-50 transition-colors duration-150 mt-2"
                href="/r/create"
              >
                Create Community
              </Link>
            </div>
          </div>

          {/* Premium section */}
          <div className="px-6 py-4 bg-gray-50 mt-3 border-t border-gray-200">
            <div className="flex flex-col gap-3">
              <h3 className="font-medium text-sm text-gray-800">
                Reddit Premium
              </h3>
              <p className="text-xs text-gray-500">
                The best Reddit experience, with monthly coins
              </p>

              {/* Premium button - Simple version with orange text */}
              <button className="block w-full border border-orange-300 text-orange-500 py-1.5 px-3 rounded-md text-xs text-center hover:bg-orange-50 transition-colors duration-150">
                Try Premium
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
