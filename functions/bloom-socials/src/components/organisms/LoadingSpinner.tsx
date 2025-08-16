import type { FC } from "hono/jsx";

export const LoadingSpinner: FC = () => {
  return (
    <div style={{ textAlign: "center", padding: "20px", color: "#666" }}>
      読み込み中...
    </div>
  );
};
