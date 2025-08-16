import type { FC } from "hono/jsx";

export const BaseLayout: FC = (props) => {
  return (
    <html lang="ja">
      <head>
        <title>GILANTIC PHOTO&apos;s HUB</title>
      </head>
      <body>{props.children}</body>
    </html>
  );
};
