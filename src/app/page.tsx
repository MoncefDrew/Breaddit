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
      <h1 className="font-bold text-3xl md:text-4xl text-gray-200 mt-10">Your feed</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
        {/*@ts-expect-error server compoennt */}
        
        {session ?  <CustomFeed/> : <GeneralFeed/>}

        {/* Subreddit info */}
        <div className="overflow-hidden rounded-lg h-fit border border-[#343536] bg-[#1A1A1B]">
          <div className="bg-[#272729] px-6 py-4">
            <p className="font-semibold py-4 flex items-center gap-1.5 text-gray-200">
              <HomeIcon className="w-4 h-4" />
              Home
            </p>
          </div>

          <div className="my-3 divide-y divide-[#343536] px-6 py-4 text-sm leading-6">
            <div className="flex justify-between gap-x-4 py-3">
              <p className="text-gray-400">
                Your personal Breaddit. Come here to check your favorite
                communities
              </p>
            </div>

            <Link
              className={buttonVariants({
                variant: 'default',
                size: 'default',
                className: "w-full mt-4 mb-6 text-white font-medium",
              })}
              style={{ backgroundColor: '#FF4500' }}
              href={`/r/create`}>
              Create Community
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}