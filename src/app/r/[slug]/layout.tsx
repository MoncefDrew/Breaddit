import SubscribeLeaveToggle from "@/components/SubscribeLeaveToggle";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { format } from "date-fns";

const Layout = async ({
  children,
  params: { slug },
}: {
  children: React.ReactNode;
  params: { slug: string };
}) => {
  // session fetching
  const session = await getAuthSession();

  // fetching posts from the subreddit with the name slug
  const subreddit = await db.subreddit.findFirst({
    where: {
      name: slug,
    },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  });

  //fetching user subscribtion from db
  const subscription = !session?.user
    ? undefined
    : await db.subscription.findFirst({
        where: {
          subreddit: {
            name: slug,
          },
          user: {
            id: session?.user.id,
          },
        },
      });

  //creation of subscription logic
  const isSubsribed = !!subscription;

  if (!subreddit) return notFound();

  //counting subreddit members
  const mebmberCount = await db.subscription.count({
    where: {
      subreddit: {
        name: slug,
      },
    },
  });

  return (
    <div className="sm-container max-w-7xl mx-auto h-full pt-12">
      {/* TODO :Button to take us back*/}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
        <div className="flex flex-col col-span-2 space-y-6">{children}</div>

        {/* infor sidebar*/}
        <div className="hidden md:block overflow-hidden h-fit rounded-lg border border-gray-200">
          <div className="px-6 py-4">
            <p className="font-semibold py-3">About r/</p>
          </div>

          <dl className="divide-y divide-gray-100 px-6 py-4 text-sm leading-6 bg-white">
            <div className="flex justify-between gap-x-4 py-3">
              <dt className="text-gray-500">Created</dt>
              <dd className="text-gray-700">
                <time dateTime={subreddit.createdAt.toDateString()}>
                  {format(subreddit.createdAt, "MMM d, yyyy")}
                </time>
              </dd>
            </div>

            <div className="flex justify-between gap-x-4 py-3">
              <dt className="text-gray-500">Members</dt>
              <dd className="text-gray-700">
                <div className="text-gray-900">{mebmberCount}</div>
              </dd>
            </div>

            {subreddit.creatorId === session?.user.id ? (
              <div className="flex justify-between gap-x-4 py-3">
                <p className="text-gray-500">You created this community</p>
              </div>
            ) : null}

            {subreddit.creatorId !== session?.user.id ? (
              <SubscribeLeaveToggle
                subredditName={subreddit.name}
                subredditId={subreddit.id}
                isSubscribed={isSubsribed}
              />
            ) : null}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Layout;
