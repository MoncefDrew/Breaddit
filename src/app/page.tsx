import { buttonVariants } from "@/components/ui/Button";
import { HomeIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1 className="font-blod text-3xl md:text-4xl">Your feed</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
        {/* feed */}

        {/* Subreddit info */}
        <div className="overflow-hiiden rounded-lg h-fit border border-gray-200 order-first">
          <div className="bg-emerald-100 px-6 py-4">
            <p className="font semi-bold py-4 flex items-center gap-1.5">
              <HomeIcon className="w-4 h-4" />
              Home
            </p>
          </div>

          <div className="my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
            <div className="flex justify-between gap-x-4 py-3">
              <p className="text-zinc-500">
                Your personal Breaddit. Come here to check your favorite
                communities
              </p>
            </div>

            <Link
              className={buttonVariants({
                className: "w-full mt-4 mb-6",
              })}
              href={`/r/create`}>
              Create Community
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
