import type { FC } from "hono/jsx";
import type { FeedItem } from "./FeedPost";
import { FeedPost } from "./FeedPost";

export interface FeedData {
  posts: FeedItem[];
}

export const FeedList: FC<{ feedData: Promise<FeedData> }> = async ({
  feedData,
}) => {
  const data = await feedData;
  console.log("FeedList data:", data);
  if (!data.posts || data.posts.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "20px", color: "#666" }}>
        フィードがありません
      </div>
    );
  }

  return (
    <>
      {data.posts.map((item) => (
        <FeedPost key={item.id} item={item} />
      ))}
    </>
  );
};
