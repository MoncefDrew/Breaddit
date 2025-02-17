import { ExtendedPost } from "@/types/db";
import { FC } from "react";
interface PostFeedProps {
  initialPosts : ExtendedPost[],
  subredditName? : string
}


const PostFeed: FC<PostFeedProps> = ({ initialPosts, subredditName }) => {
  return <div>PostFeed</div>;
};

export default PostFeed;
