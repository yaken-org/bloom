import { Hono } from "hono";
import { showRoutes } from "hono/dev";
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
  return c.render(<div>Home</div>);
});

showRoutes(app);
export default app;
