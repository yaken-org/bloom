import type { FilterType, FilterConfiguration, FilterComponent } from '@/types/filters';
import ImageMagickFilter from '@/components/filters/ImageMagickFilter';
import GlitteryFilter from '@/components/filters/GlitteryFilter';
import OverlayFilter from '@/components/filters/OverlayFilter';

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
      type: 'imageMagick',
      name: 'ImageMagick風',
      description: 'ImageMagick風の効果 (エッジ検出、色反転、彩度強化等)',
      component: ImageMagickFilter,
      defaultEnabled: false,
      color: '#007AFF',
      category: 'enhancement'
    });

    this.registerFilter({
      type: 'glittery',
      name: 'ギラギラ',
      description: 'ギラギラフィルター (超高彩度、メタリック効果等)',
      component: GlitteryFilter,
      defaultEnabled: false,
      color: '#34C759',
      category: 'artistic'
    });

    this.registerFilter({
      type: 'overlay',
      name: 'オーバーレイ',
      description: 'オーバーレイ効果',
      component: OverlayFilter,
      defaultEnabled: false,
      color: '#FF9500',
      category: 'blend',
      requiresAsset: true
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
      config => config.category === category
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
    const priorityOrder: FilterType[] = ['overlay', 'imageMagick', 'glittery', 'sepia', 'blue'];
    
    // 優先順序に従って並べた後、残りを追加
    const orderedTypes: FilterType[] = [];
    
    // 優先順序のフィルターを最初に追加
    priorityOrder.forEach(type => {
      if (availableTypes.includes(type)) {
        orderedTypes.push(type);
      }
    });
    
    // 優先順序にないフィルターを後に追加
    availableTypes.forEach(type => {
      if (!orderedTypes.includes(type)) {
        orderedTypes.push(type);
      }
    });
    
    return orderedTypes;
  }
}

// シングルトンインスタンスをエクスポート
export const filterFactory = FilterFactory.getInstance();
