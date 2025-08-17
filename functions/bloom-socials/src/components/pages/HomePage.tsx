import type { FC } from "hono/jsx";
import type { FeedData } from "@/components/organisms/FeedList";
import { FeedTimeline } from "@/components/templates/FeedTimeline";

interface HomePageProps {
  posts: {
    id: string;
    imageId: string;
    authorName: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
}

export const HomePage: FC<HomePageProps> = ({ posts }) => {
  // postsデータを既に持っているので、Promise.resolveでラップ
  const feedData: FeedData = {
    posts: posts.map(post => ({
      ...post,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    }))
  };
  const feedPromise = Promise.resolve(feedData);

  return <FeedTimeline feedPromise={feedPromise} />;
};
