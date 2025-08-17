import type { FC } from "hono/jsx";
import { formatDate } from "@/util/datetime";

export interface FeedItem {
  id: string;
  authorName: string;
  createdAt: string;
}

export const FeedPost: FC<{ item: FeedItem }> = ({ item }) => {
  return (
    <article style={{ borderBottom: "1px solid #e0e0e0", padding: "16px 0" }}>
      <div style={{ display: "flex", gap: "12px" }}>
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            background: "#ddd",
            flexShrink: "0",
          }}
        />
        <div style={{ flex: "1" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px",
            }}
          >
            <span style={{ fontWeight: "bold" }}>{item.authorName}</span>
            <span style={{ color: "#666", fontSize: "14px" }}>
              {formatDate(item.createdAt)}
            </span>
          </div>
          <div style={{ marginBottom: "12px" }}>
            <img
              src={`/api/v1/posts/${item.id}/image`}
              alt={`投稿画像`}
              style={{
                maxWidth: "100%",
                height: "auto",
                borderRadius: "12px",
                cursor: "pointer",
              }}
              loading="lazy"
            />
          </div>
          <div
            style={{
              display: "flex",
              gap: "16px",
              color: "#666",
              fontSize: "12px",
            }}
          ></div>
        </div>
      </div>
    </article>
  );
};
