import { filterFactory } from "@/lib/filters/FilterFactory";
import type { FilterOptions, OverlayFilterOptions } from "@/types/filters";

// ギラギラ系のフィルタータイプ
const FILTERS = ["dazzling", "neon", "pachinko", "jewel", "rainbow", "blue", "sepia", "electric", "glitch"];
import DarkFilter from "@/components/filters/DarkFilter";


// フレーム画像をrequireで事前読み込み
const FRAME_IMAGES = [
  //require("@/assets/flames/gold_frame.png"),
  //require("@/assets/flames/mirror_frame.png"),
  //require("@/assets/flames/mirror_yellow_frame.png"),
  //require("@/assets/flames/purple_frame.png"),
  //require("@/assets/flames/red_frame.png"),
  //require("@/assets/flames/yellow_frame.png"),
  //require("@/assets/flames/wabi_orange.png"),
  //   require("@/assets/flames/gira_green.png"),
  //   require("@/assets/flames/gira_purple.png"),
  //   require("@/assets/flames/gira_blue.png"),
  //   require("@/assets/flames/gira_red.png"),
  //   require("@/assets/flames/gira_yellow.png"),
  //   require("@/assets/flames/mirror_orange.png"),
  require("@/assets/flames/gira_photo.png"),
];

/**
 * 現在登録されているフィルターから2つをランダムに選ぶユースケース
 * @returns {[string[], FilterOptions]} ランダムに選択されたフィルター名の配列とオプション
 */
export default function getRandomGlitteryFilters(): [string[], FilterOptions] {
  const availableGlittery = FILTERS.filter(f => filterFactory.hasFilter(f));

  if (availableGlittery.length === 0) return [[], {}];

  // ランダムに2〜3個選択
  const shuffled = fisherYatesShuffle(availableGlittery);
  const count = Math.min(3, shuffled.length); // 最大3つ
  const selectedFilters = shuffled.slice(0, count);

  // オーバーレイフィルターを必ず追加
  selectedFilters.unshift("overlay");

  const overlayImageUrl = chooseOverlayImageUrl();
  const options: FilterOptions = overlayImageUrl
    ? ({
        overlayImageUrl,
        opacity: 1,
        blendMode: undefined,
      } as OverlayFilterOptions)
    : {};

  return [selectedFilters, options];
}

function chooseOverlayImageUrl() {
  return fisherYatesShuffle(FRAME_IMAGES)[0];
}

function fisherYatesShuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
