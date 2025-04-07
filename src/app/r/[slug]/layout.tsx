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
    <div className="flex bg-[#0E1113] w-full flex-col px-0 md:mx-auto md:px-4">
      <div className="md:col-span-2">{children}</div>
    </div>
  );
};

export default Layout;
