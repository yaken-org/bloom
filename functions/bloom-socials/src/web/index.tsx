import { Hono } from "hono";
import { showRoutes } from "hono/dev";
import { HomePage } from "@/components/pages/HomePage";
import { v1Route } from "@/web/api/feed";
import { DefaultRendererMiddleware } from "./middleware/renderer";

export function newApp() {
  return new Hono<{ Bindings: CloudflareBindings }>().use(
    DefaultRendererMiddleware,
  );
}

const app = newApp();

app.route("/api/v1", v1Route);

app.get("/", async (c) => {
  const apiUrl = `${c.req.url.replace(/\/$/, "")}/api/v1`;
  return c.render(<HomePage apiUrl={apiUrl} />);
});

showRoutes(app);
export default app;
