import type { FC } from "hono/jsx";
import { PostDetail } from "@/components/templates/PostDetail";

interface PostDetailPageProps {
  apiUrl: string;
  postId: string;
}

interface PostData {
  post: {
    id: string;
    imageId: string;
    authorName: string;
    createdAt: string;
    updatedAt: string;
  } | null;
}

export const PostDetailPage: FC<PostDetailPageProps> = ({ apiUrl, postId }) => {
  const postPromise = fetch(`${apiUrl}/posts/${postId}`)
    .then((res) => res.json() as Promise<PostData>)
    .catch((error): PostData => {
      console.error("Error fetching post:", error);
      return { post: null };
    });

  return <PostDetail postPromise={postPromise} />;
};
