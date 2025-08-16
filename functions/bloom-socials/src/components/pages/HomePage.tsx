import type { FC } from "hono/jsx";
import type { FeedData } from "@/components/organisms/FeedList";
import { FeedTimeline } from "@/components/templates/FeedTimeline";

interface HomePageProps {
  apiUrl: string;
}

export const HomePage: FC<HomePageProps> = ({ apiUrl }) => {
  const feedPromise = fetch(`${apiUrl}/feed`)
    .then((res) => res.json() as Promise<FeedData>)
    .catch((error): FeedData => {
      console.error("Error fetching feed:", error);
      return { images: { objects: [], truncated: false } };
    });

  return <FeedTimeline feedPromise={feedPromise} />;
};
