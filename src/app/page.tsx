import GeneralFeed from "@/components/GeneralFeed";
import { buttonVariants } from "@/components/ui/Button";
import { getAuthSession } from "@/lib/auth";
import { HomeIcon } from "lucide-react";
import Link from "next/link";
import CustomFeed from "@/components/CustomFeed";

export default async function Home() {
  
  const session = await getAuthSession()

  return (
    <>
      <h1 className="font-bold text-3xl md:text-4xl text-zinc-200 mt-14 px-4">Your feed</h1>
      <div className="grid grid-cols-1 px-4  md:grid-cols-3 gap-y-2 md:gap-x-4 py-6">
        {/*@ts-expect-error server compoennt */}
        
        {session ?  <CustomFeed/> : <GeneralFeed/>}

        {/* Subreddit info */}
        <div className="overflow-hidden rounded-lg h-fit border border-custom bg-surface order-first md:order-last">
          <div className="bg-surface-dark-hover px-6 py-4">
            <p className="font-semibold flex items-center gap-2.5 text-primary">
              <HomeIcon className="w-5 h-5" />
              <span className="text-lg">Home</span>
            </p>
          </div>

          <div className="px-6 py-4">
            <div className="flex flex-col gap-4">
              <p className="text-sm leading-6 text-muted">
                Your personal Breaddit frontpage. Come here to check in with your
                favorite communities.
              </p>
              
              <div className="h-[1px] bg-custom/60" />
              
              <div className="space-y-2">
                <h3 className="font-medium text-sm text-primary">Getting Started</h3>
                <ul className="text-sm space-y-2 text-muted">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-reddit" />
                    Create and join communities
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-reddit" />
                    Share and discuss interesting content
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-reddit" />
                    Earn karma and awards
                  </li>
                </ul>
              </div>

              <Link
                className={buttonVariants({
                  className: "w-full bg-gradient-to-r from-reddit to-orange-500 hover:from-reddit-hover hover:to-orange-600 text-white font-medium shadow-sm transition-all duration-200",
                })}
                href="/r/create">
                Create Community
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}