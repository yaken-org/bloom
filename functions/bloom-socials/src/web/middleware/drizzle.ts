import { createMiddleware } from "hono/factory";
import { getDrizzleDB } from "@/db/drizzle";

export const DrizzleMiddleware = createMiddleware(async (c, next) => {
  c.set("drizzle", getDrizzleDB(c.env.DB));
  return next();
});
