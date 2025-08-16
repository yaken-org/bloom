import { filterFactory } from "@/lib/filters/FilterFactory";
/**
 * 現在登録されているフィルターから2つをランダムに選ぶユースケース
 * @returns {string[]} ランダムに選択された2つのフィルター名の配列
 */
export default function getRandomFilters(): string[] {
  // 登録されている全フィルターのタイプを取得
  const availableFilters = filterFactory.getAvailableFilterTypes();

  // フィルターが2つ未満の場合は利用可能な全てを返す
  if (availableFilters.length <= 2) {
    return availableFilters;
  }

  // ランダムに2つ選択
  const shuffled = fisherYatesShuffle(availableFilters);
  return shuffled.slice(0, 2);
}

function fisherYatesShuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

