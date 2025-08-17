import type { FC } from "hono/jsx";
import { PostDetail } from "@/components/templates/PostDetail";

interface PostDetailPageProps {
  post: {
    id: string;
    imageId: string;
    authorName: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

export const PostDetailPage: FC<PostDetailPageProps> = ({ post }) => {
  // postデータを既に持っているので、Promise.resolveでラップ
  const postData = {
    post: {
      ...post,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    }
  };
  const postPromise = Promise.resolve(postData);

  return <PostDetail postPromise={postPromise} />;
};
