import { filterFactory } from "@/lib/filters/FilterFactory";
import type {
  FilterOptions,
  FilterType,
  OverlayFilterOptions,
} from "@/types/filters";

// ギラギラ系のフィルタータイプ
const FILTERS: FilterType[] = [
  "dazzling",
  "neon",
  "pachinko",
  "jewel",
  "rainbow",
  "blue",
  // "sepia",
  "electric",
  "glittery",
  "dark",
];

// フレーム画像をrequireで事前読み込み
const FRAME_IMAGES = [require("@/assets/flames/gira_photo.png")];

/**
 * ランダムにフィルターを選ぶが、順序は固定
 */
export default function getRandomGlitteryFilters(): [
  FilterType[],
  FilterOptions,
] {
  const availableGlittery = FILTERS.filter((f) => filterFactory.hasFilter(f));

  if (availableGlittery.length === 0) return [[], {}];

  // ランダムに選ぶ（overlay を除く）
  const shuffled = fisherYatesShuffle(availableGlittery);
  const selectedCount = Math.min(2, shuffled.length); // ランダムで2つ
  const randomSelected = shuffled.slice(0, selectedCount);

  // フィルター順序を固定
  const fixedOrder: FilterType[] = [
    "neon",
    "pachinko",
    "electric",
    "blue",
    "sepia",
    "imageMagick",
    "glittery",
    "jewel",
    "dazzling",
    "dark",
    "overlay",
  ];

  // fixedOrder に沿って並べる（overlay は先頭）
  const finalFilters = fixedOrder.filter(
    (f) => f === "overlay" || randomSelected.includes(f),
  );
  const orderedFilters = [
    "overlay",
    ...finalFilters.filter((f) => f !== "overlay"),
  ];

  // overlay 用画像
  const overlayImageUrl = chooseOverlayImageUrl();
  const options: FilterOptions = overlayImageUrl
    ? ({
        overlayImageUrl,
        opacity: 1,
        blendMode: undefined,
      } as OverlayFilterOptions)
    : {};

  return [orderedFilters, options];
}

function chooseOverlayImageUrl() {
  return FRAME_IMAGES[0]; // 必ず先頭の画像
}

function fisherYatesShuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
