import CommunityAboutCard from "@/components/community/CommunityAboutCard";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Breadit",
  description: "A Reddit clone built with Next.js and TypeScript.",
};

const Layout = async ({
  children,
  params: { slug },
}: {
  children: ReactNode;
  params: { slug: string };
}) => {

  // Just check if the subreddit exists - all other data is now handled in the page component
  const subreddit = await db.subreddit.findFirst({
    where: { name: slug },
    include: {
      rules: true,
    },
  });

  

  if (!subreddit) return notFound();

  return (
    <div className="w-full max-w-full mx-auto h-full pt-6 sm:pt-10 px-0 sm:px-2 md:px-4">
      <div className="md:col-span-2">
        {children}
      </div>
    </div>
  );
};

export default Layout;
