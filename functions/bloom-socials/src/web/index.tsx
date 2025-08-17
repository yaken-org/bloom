import { desc } from "drizzle-orm";
import { Hono } from "hono";
import { HomePage } from "@/components/pages/HomePage";
import { PostDetailPage } from "@/components/pages/PostDetailPage";
import type { DrizzleDB } from "@/db/drizzle";
import { posts } from "@/db/schema";
import { PostsRoute } from "@/web/api/posts";
import { DrizzleMiddleware } from "@/web/middleware/drizzle";
import { DefaultRendererMiddleware } from "@/web/middleware/renderer";

export function newApp() {
  const app = new Hono<{
    Bindings: CloudflareBindings;
    Variables: {
      drizzle: DrizzleDB;
    };
  }>()
    .use(DefaultRendererMiddleware)
    .use(DrizzleMiddleware);
  return app;
}

const app = newApp();

app.route("/api/v1/posts", PostsRoute);

app.get("/", async (c) => {
  const db = c.var.drizzle;

  const result = await db.query.posts.findMany({
    orderBy: desc(posts.createdAt),
    limit: 10,
  });

  return c.render(<HomePage posts={result} />);
});

app.get("/post/:id", async (c) => {
  const postId = c.req.param("id");
  const db = c.var.drizzle;

  // 投稿データを取得
  const post = await db.query.posts.findFirst({
    where: (posts, { eq }) => eq(posts.id, postId),
  });

  if (!post) {
    return c.notFound();
  }

  return c.render(<PostDetailPage post={post} />);
});

export default app;
