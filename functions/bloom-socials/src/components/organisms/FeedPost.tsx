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
      <a
        href={`/post/${item.id}`}
        style={{ textDecoration: "none", color: "inherit", display: "block" }}
      >
        <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "#ddd",
              flexShrink: "0",
            }}
          />
          <div style={{ flex: "1", minWidth: "0" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px",
                flexWrap: "wrap",
              }}
            >
              <span style={{ fontWeight: "bold", textDecoration: "none" }}>
                {item.authorName}
              </span>
              <span style={{ color: "#666", fontSize: "12px" }}>
                {formatDate(item.createdAt)}
              </span>
            </div>
            <div style={{ marginBottom: "12px" }}>
              <img
                src={`/api/v1/posts/${item.id}/image`}
                alt={`投稿画像`}
                style={{
                  width: "100%",
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: "12px",
                  cursor: "pointer",
                  objectFit: "cover",
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
      </a>
    </article>
  );
};
