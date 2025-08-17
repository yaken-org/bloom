import { Hono } from "hono";
import { HomePage } from "@/components/pages/HomePage";
import { PostDetailPage } from "@/components/pages/PostDetailPage";
import type { DrizzleDB } from "@/db/drizzle";
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
  const apiUrl = `${c.req.url.replace(/\/$/, "")}/api/v1`;
  return c.render(<HomePage apiUrl={apiUrl} />);
});

app.get("/post/:id", async (c) => {
  const postId = c.req.param("id");
  const baseUrl = new URL(c.req.url).origin;
  const apiUrl = `${baseUrl}/api/v1`;
  return c.render(<PostDetailPage apiUrl={apiUrl} postId={postId} />);
});

export default app;
