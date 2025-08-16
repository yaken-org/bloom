import BlueFilter from "@/components/filters/BlueFilter";
import SepiaFilter from "@/components/filters/SepiaFilter";
import { filterFactory } from "@/lib/filters/FilterFactory";

/**
 * カスタムフィルターの登録例
 *
 * 新しいフィルターを追加する手順:
 * 1. フィルターコンポーネントを作成 (FilterComponentPropsを実装)
 * 2. このファイルで filterFactory.registerFilter() を呼び出す
 * 3. 必要に応じてテストページでフィルターを使用
 *
 * 注意: このファイルはアプリケーション初期化時に実行されるようにしてください
 */

// フィルター登録の状態を追跡
let filtersRegistered = false;

export const registerCustomFilters = () => {
  if (filtersRegistered) {
    return;
  }

  try {
    // セピアフィルターを登録
    filterFactory.registerFilter({
      type: "sepia",
      name: "セピア",
      description: "ビンテージな茶色がかった効果",
      component: SepiaFilter,
      defaultEnabled: false,
      color: "#8B4513",
      category: "artistic",
    });

    // ブルーフィルターを登録
    filterFactory.registerFilter({
      type: "blue",
      name: "ブルートーン",
      description: "クールで青みがかった効果",
      component: BlueFilter,
      defaultEnabled: false,
      color: "#4169E1",
      category: "artistic",
    });

    filtersRegistered = true;
  } catch (error) {
    console.error("カスタムフィルターの登録に失敗しました:", error);
  }
};

// 実際のアプリケーションでは、App.tsx や main エントリーポイントで実行
// モジュール読み込み時に実行
registerCustomFilters();
