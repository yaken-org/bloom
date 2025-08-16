import { Hono } from "hono";
import { showRoutes } from "hono/dev";
import { nanoid } from "nanoid";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.get("/api/v1/feed", async (c) => {
  const cursor = await c.req.query("cursor");

  const images = await c.env.bloom_socials.list({
    limit: 100,
    cursor: cursor,
  });

  return c.json({
    images: images,
  });
});

app.post("/api/v1/feed", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get("image");

    if (!file) {
      return c.json({ error: "Missing image" }, 400);
    }
    if (!(file instanceof File)) {
      return c.json({ error: "Invalid image" }, 400);
    }

    const fileExtension = file.name.split(".").pop() || "jpg";
    const newFileName = `${nanoid()}.${fileExtension}`;

    await c.env.bloom_socials.put(newFileName, file.stream(), {
      httpMetadata: {
        contentType: file.type,
      },
    });

    return c.json({ id: newFileName });
  } catch (error) {
    console.error("Error uploading image:", error);
    return c.json({ error: "Failed to upload image" }, 500);
  }
});

app.get("/api/v1/feed/:id", async (c) => {
  const { id } = c.req.param();

  const image = await c.env.bloom_socials.get(id);

  if (!image) {
    return c.notFound();
  }

  return c.body(image.body, 200, {
    "Content-Type": "image/jpeg",
    "Cache-Control": "public, max-age=31536000, immutable",
  });
});

app.delete("/api/v1/feed/:id", async (c) => {
  const { id } = c.req.param();

  await c.env.bloom_socials.delete(id);

  return c.json({ success: true });
});

showRoutes(app);
export default app;
