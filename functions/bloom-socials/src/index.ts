import { Hono } from "hono";
import { showRoutes } from "hono/dev";
import { v1Route } from "./api/feed";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.route("/api/v1", v1Route);

showRoutes(app);
export default app;
