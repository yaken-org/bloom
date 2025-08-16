import BlueFilter from "@/components/filters/BlueFilter";
import GlitteryFilter from "@/components/filters/GlitteryFilter";
import ImageMagickFilter from "@/components/filters/ImageMagickFilter";
import OverlayFilter from "@/components/filters/OverlayFilter";
import SepiaFilter from "@/components/filters/SepiaFilter";
import DazzlingFilter from "@/components/filters/DazzlingFilter";
import RainbowFilter from "@/components/filters/RainbowFilter";
import NeonFilter from "@/components/filters/NeonFilter";
import ElectricFilter from "@/components/filters/ElectricFilter";
import PachinkoFilter from "@/components/filters/PachinkoFilter";
import JewelFilter from "@/components/filters/JewelFilter";

import type {
  FilterComponent,
  FilterConfiguration,
  FilterType,
} from "@/types/filters";

/**
 * フィルターファクトリークラス
 * フィルターの登録、作成、管理を行う
 */
export class FilterFactory {
  private static instance: FilterFactory;
  private filterRegistry = new Map<FilterType, FilterConfiguration>();

  private constructor() {
    this.initializeDefaultFilters();
  }

  public static getInstance(): FilterFactory {
    if (!FilterFactory.instance) {
      FilterFactory.instance = new FilterFactory();
    }
    return FilterFactory.instance;
  }

  /**
   * デフォルトフィルターを初期化
   */
  private initializeDefaultFilters(): void {
    this.registerFilter({
      type: "sepia",
      name: "セピア",
      description: "ビンテージな茶色がかったセピアトーン効果",
      component: SepiaFilter,
      defaultEnabled: false,
      color: "#8B4513",
      category: "artistic",
    });

    this.registerFilter({
      type: "blue",
      name: "ブルー",
      description: "クールで青みがかったトーン効果",
      component: BlueFilter,
      defaultEnabled: false,
      color: "#4169E1",
      category: "artistic",
    });

    this.registerFilter({
      type: "imageMagick",
      name: "ImageMagick風",
      description: "ImageMagick風の効果 (エッジ検出、色反転、彩度強化等)",
      component: ImageMagickFilter,
      defaultEnabled: false,
      color: "#007AFF",
      category: "enhancement",
    });

    this.registerFilter({
      type: "glittery",
      name: "ギラギラ",
      description: "ギラギラフィルター (超高彩度、メタリック効果等)",
      component: GlitteryFilter,
      defaultEnabled: false,
      color: "#34C759",
      category: "artistic",
    });

    this.registerFilter({
      type: "overlay",
      name: "オーバーレイ",
      description: "オーバーレイ効果",
      component: OverlayFilter,
      defaultEnabled: false,
      color: "#FF9500",
      category: "blend",
      requiresAsset: true,
    });

    this.registerFilter({
      type: "dazzling",
      name: "ダズリング",
      description: "高彩度で輝きのある華やかフィルター",
      component: DazzlingFilter,
      defaultEnabled: false,
      color: "#FFD700",
      category: "artistic",
    });

    this.registerFilter({
      type: "rainbow",
      name: "レインボー",
      description: "虹色の彩度と明るさを強調するフィルター",
      component: RainbowFilter,
      defaultEnabled: false,
      color: "#FF69B4",
      category: "artistic",
    });

    this.registerFilter({
      type: "neon",
      name: "ネオン",
      description: "鮮やかなネオンカラーの光沢を付与するフィルター",
      component: NeonFilter,
      defaultEnabled: false,
      color: "#8A2BE2",
      category: "artistic",
    });

    this.registerFilter({
      type: "electric",
      name: "エレクトリック",
      description: "強烈なコントラストと光沢で電気的な印象にするフィルター",
      component: ElectricFilter,
      defaultEnabled: false,
      color: "#00FF00",
      category: "artistic",
    });

    this.registerFilter({
      type: "pachinko",
      name: "パチンコ",
      description: "華やかでキラキラ感を強調したカラフルフィルター",
      component: PachinkoFilter,
      defaultEnabled: false,
      color: "#FF1493",
      category: "artistic",
    });

    this.registerFilter({
      type: "jewel",
      name: "ジュエル",
      description: "宝石のような鮮やかで煌めく効果を適用",
      component: JewelFilter,
      defaultEnabled: false,
      color: "#00CED1",
      category: "artistic",
    });
  }

  /**
   * フィルターを登録
   */
  public registerFilter(config: FilterConfiguration): void {
    this.filterRegistry.set(config.type, config);
  }

  /**
   * フィルターの登録を解除
   */
  public unregisterFilter(type: FilterType): void {
    this.filterRegistry.delete(type);
  }

  /**
   * フィルター設定を取得
   */
  public getFilterConfig(type: FilterType): FilterConfiguration | undefined {
    return this.filterRegistry.get(type);
  }

  /**
   * 全てのフィルター設定を取得
   */
  public getAllFilterConfigs(): FilterConfiguration[] {
    return Array.from(this.filterRegistry.values());
  }

  /**
   * フィルターコンポーネントを取得
   */
  public getFilterComponent(type: FilterType): FilterComponent | undefined {
    const config = this.filterRegistry.get(type);
    return config?.component;
  }

  /**
   * フィルターが存在するかチェック
   */
  public hasFilter(type: FilterType): boolean {
    return this.filterRegistry.has(type);
  }

  /**
   * カテゴリ別のフィルター取得
   */
  public getFiltersByCategory(category: string): FilterConfiguration[] {
    return Array.from(this.filterRegistry.values()).filter(
      (config) => config.category === category,
    );
  }

  /**
   * 利用可能なフィルタータイプのリストを取得
   */
  public getAvailableFilterTypes(): FilterType[] {
    return Array.from(this.filterRegistry.keys());
  }

  /**
   * デフォルトのフィルター順序を取得
   */
  public getDefaultFilterOrder(): FilterType[] {
    const availableTypes = this.getAvailableFilterTypes();

    // 優先順序を定義（存在するもののみ使用）
    const priorityOrder: FilterType[] = [
      "sepia",
      "blue",
      "overlay",
      "imageMagick",
      "glittery",
    ];

    // 優先順序に従って並べた後、残りを追加
    const orderedTypes: FilterType[] = [];

    // 優先順序のフィルターを最初に追加
    priorityOrder.forEach((type) => {
      if (availableTypes.includes(type)) {
        orderedTypes.push(type);
      }
    });

    // 優先順序にないフィルターを後に追加
    availableTypes.forEach((type) => {
      if (!orderedTypes.includes(type)) {
        orderedTypes.push(type);
      }
    });

    return orderedTypes;
  }
}

// シングルトンインスタンスをエクスポート
export const filterFactory = FilterFactory.getInstance();
