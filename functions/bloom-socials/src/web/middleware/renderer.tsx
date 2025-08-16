import { createMiddleware } from "hono/factory";
import { BaseLayout } from "@/components/layouts/Base";

export const DefaultRendererMiddleware = createMiddleware(async (c, next) => {
  c.setRenderer((content) => {
    return c.html(<BaseLayout>{content}</BaseLayout>);
  });

  await next();
});
