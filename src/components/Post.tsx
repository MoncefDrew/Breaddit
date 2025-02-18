import { formatTimeToNow } from "@/lib/utils";
import { User, Vote,Post } from "@prisma/client";
import { FC } from "react";

interface PostProps {
    post: Post & {
      author: User
      votes: Vote[],
      
    },
    subredditName:string}
    

const Post: FC<PostProps> = ({
    post,
    subredditName,
}) => {
  return (
    <div className="rounded-md bg-white shadow">
      <div className="px-6 py-4 flex justify-between">
        <div className="w-0 flex-1">
          <div className="max-h-40 mt-1 text-xs text-gray-500">
            {subredditName ? (
              <>
                <a
                  className="underline text-zinc-900 text-sm underline-offset-2"
                  href={`/r/${subredditName}`}
                >
                  r/{subredditName}
                </a>
                <span className="px-1">•</span>
              </>
            ) : null}
            <span>Posted by u/{post.author.username}</span>{" • "}
            {formatTimeToNow(new Date(post.createdAt))}
          </div>
          <a href={`/r/${subredditName}/post/${post.id}`}>
            <h1 className="text-lg font-semibold py-2 leading-6 text-gray-900">
              {post.title}
            </h1>
          </a>
        </div>
      </div>
    </div>
  );
};


export default Post