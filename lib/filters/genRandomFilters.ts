import { filterFactory } from "@/lib/filters/FilterFactory";
import type { FilterOptions, OverlayFilterOptions } from "@/types/filters";

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
    ? { overlayImageUrl } as OverlayFilterOptions
    : {};
  
  return [selectedFilters, options];
}

function chooseOverlayImageUrl(): string {
    return fisherYatesShuffle(["/assets/flames/gold_frame.png",
        "/assets/flames/mirror_frame.png",
        "/assets/flames/purple_frame.png",
        "/assets/flames/red_frame.png",
        "/assets/flames/yellow_frame.png"
    ])[0];
}

function fisherYatesShuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
