import { newApp } from "@/web/index";

const app = newApp();

app.get("/", async (c) => {
  const feeds: readonly R2Object[] = (
    await c.env.bloom_socials.list({ limit: 20 })
  ).objects;

  return c.render(
    <div>
      <h1>Home</h1>
      <ul>
        {feeds.map((feed) => (
          <li key={feed.key}>{feed.key}</li>
        ))}
      </ul>
    </div>,
  );
});

export const PublicRoute = app;
