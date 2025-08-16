import { desc, eq } from "drizzle-orm";
import { Hono } from "hono";
import { nanoid } from "nanoid";
import type { DrizzleDB } from "@/db/drizzle";
import { posts } from "@/db/schema";

const app = new Hono<{
  Bindings: CloudflareBindings;
  Variables: {
    drizzle: DrizzleDB;
  };
}>();

app.get("/", async (c) => {
  const db = c.var.drizzle;

  const result = await db.query.posts.findMany({
    orderBy: desc(posts.createdAt),
    limit: 10,
  });

  return c.json({ posts: result });
});

app.post("/", async (c) => {
  const db = c.var.drizzle;

  try {
    const formData = await c.req.formData();
    const file = formData.get("image");

    if (!file) {
      return c.json({ error: "Missing image" }, 400);
    }
    if (!(file instanceof File)) {
      return c.json({ error: "Invalid image" }, 400);
    }

    // 本当はバイナリを見て拡張子を決定したいが簡単のためにファイル名から取得
    const fileExtension = file.name.split(".").pop() || "jpg";

    const id = nanoid();
    const image = await c.env.bloom_socials.put(
      `${id}.${fileExtension}`,
      file.stream(),
      {
        httpMetadata: {
          contentType: file.type,
        },
      },
    );

    const result = await db
      .insert(posts)
      .values({
        id: id,
        imageId: image.key,
        authorName: "匿名さん",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    console.log(result);

    return c.json({ id: id, imageId: image.key });
  } catch (error) {
    console.error("Error uploading image:", error);
    return c.json({ error: "Failed to upload image" }, 500);
  }
});

app.get("/:id", async (c) => {
  const { id } = c.req.param();
  const db = c.var.drizzle;

  const post = await db.query.posts.findFirst({
    where: eq(posts.id, id),
    with: {
      reactions: true,
    },
  });

  if (!post) {
    return c.json({ error: "Post not found" }, 404);
  }

  return c.json({ post });
});

app.get("/:id/image", async (c) => {
  const { id } = c.req.param();
  const db = c.var.drizzle;

  const post = await db.query.posts.findFirst({
    where: eq(posts.id, id),
  });

  if (!post) {
    return c.json({ error: "Post not found" }, 404);
  }

  const image = await c.env.bloom_socials.get(post.imageId);

  if (!image) {
    return c.notFound();
  }

  return c.body(image.body, 200, {
    "Content-Type": "image/jpeg",
    "Cache-Control": "public, max-age=31536000, immutable",
  });
});

export const PostsRoute = app;
