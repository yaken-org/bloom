import type { FC } from "hono/jsx";
import { Suspense } from "hono/jsx";
import type { FeedData } from "@/components/organisms/FeedList";
import { FeedList } from "@/components/organisms/FeedList";
import { LoadingSpinner } from "@/components/organisms/LoadingSpinner";

interface FeedTimelineProps {
  feedPromise: Promise<FeedData>;
}

export const FeedTimeline: FC<FeedTimelineProps> = ({ feedPromise }) => {
  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <header
        style={{
          borderBottom: "1px solid #e0e0e0",
          paddingBottom: "16px",
          marginBottom: "16px",
        }}
      >
        <h1 style={{ fontSize: "24px", fontWeight: "bold", margin: "0" }}>
          フィード
        </h1>
      </header>
      <Suspense fallback={<LoadingSpinner />}>
        <FeedList feedData={feedPromise} />
      </Suspense>
    </div>
  );
};
