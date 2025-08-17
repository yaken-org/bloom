import type { FC } from "hono/jsx";
import { Suspense } from "hono/jsx";
import { BaseLayout } from "@/components/layouts/Base";
import { LoadingSpinner } from "@/components/organisms/LoadingSpinner";
import { formatDate } from "@/util/datetime";

interface Post {
  id: string;
  imageId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

interface PostDetailData {
  post: Post | null;
}

interface PostDetailProps {
  postPromise: Promise<PostDetailData>;
}

const PostContent: FC<{ data: PostDetailData }> = ({ data }) => {
  if (!data.post) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
        投稿が見つかりませんでした
      </div>
    );
  }

  const post = data.post;

  return (
    <article style={{ padding: "16px 0" }}>
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
            <span style={{ fontWeight: "bold" }}>{post.authorName}</span>
            <span style={{ color: "#666", fontSize: "14px" }}>
              {formatDate(post.createdAt)}
            </span>
          </div>
          <div style={{ marginBottom: "12px" }}>
            <img
              src={`/api/v1/posts/${post.id}/image`}
              alt="投稿画像"
              style={{
                maxWidth: "100%",
                height: "auto",
                borderRadius: "12px",
              }}
            />
          </div>
        </div>
      </div>
    </article>
  );
};

const PostDetailContent: FC<{ postPromise: Promise<PostDetailData> }> = async ({ postPromise }) => {
  const data = await postPromise;
  return <PostContent data={data} />;
};

export const PostDetail: FC<PostDetailProps> = ({ postPromise }) => {
  return (
    <BaseLayout>
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
        <div style={{ marginBottom: "20px" }}>
          <a href="/" style={{ color: "#1da1f2", textDecoration: "none" }}>
            ← ホームに戻る
          </a>
        </div>
        <Suspense fallback={<LoadingSpinner />}>
          <PostDetailContent postPromise={postPromise} />
        </Suspense>
      </div>
    </BaseLayout>
  );
};