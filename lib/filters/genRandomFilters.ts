import { filterFactory } from "@/lib/filters/FilterFactory";
import type { FilterOptions, OverlayFilterOptions } from "@/types/filters";

// フレーム画像をrequireで事前読み込み
const FRAME_IMAGES = [
  require("@/assets/flames/gold_frame.png"),
  require("@/assets/flames/mirror_frame.png"),
  require("@/assets/flames/purple_frame.png"),
  require("@/assets/flames/red_frame.png"),
  require("@/assets/flames/yellow_frame.png")
];

/**
 * 現在登録されているフィルターから2つをランダムに選ぶユースケース
 * @returns {[string[], FilterOptions]} ランダムに選択されたフィルター名の配列とオプション
 */
export default function getRandomFilters(): [string[], FilterOptions] {
  // 登録されている全フィルターのタイプを取得
  const availableFilters = filterFactory.getAvailableFilterTypes();

  // フィルターが2つ未満の場合は利用可能な全てを返す
  if (availableFilters.length <= 2) {
    return [availableFilters, {}];
  }

  // ランダムに2つ選択
  const shuffled = fisherYatesShuffle(availableFilters);
  const selectedFilters = shuffled.slice(0, 2);
  
  // オーバーレイフィルターを追加
  selectedFilters.splice(1, 0, "overlay");

  const overlayImageUrl = chooseOverlayImageUrl();
  // オーバーレイフィルターのオプションを設定
  const options: FilterOptions = overlayImageUrl
    ? { overlayImageUrl, opacity: 1, blendMode: "colorDodge" } as OverlayFilterOptions
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
