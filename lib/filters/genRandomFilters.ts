
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
};
