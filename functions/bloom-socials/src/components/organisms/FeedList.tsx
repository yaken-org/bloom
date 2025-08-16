import type { FC } from "hono/jsx";
import type { FeedItem } from "./FeedPost";
import { FeedPost } from "./FeedPost";

export interface FeedData {
  images: {
    objects: FeedItem[];
    truncated: boolean;
    cursor?: string;
  };
}

export const FeedList: FC<{ feedData: Promise<FeedData> }> = async ({
  feedData,
}) => {
  const data = await feedData;

  if (!data.images?.objects || data.images.objects.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "20px", color: "#666" }}>
        フィードがありません
      </div>
    );
  }

  return (
    <>
      {data.images.objects.map((item) => (
        <FeedPost key={item.key} item={item} />
      ))}
    </>
  );
};
