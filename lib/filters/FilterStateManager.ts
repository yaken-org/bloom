import type {
  FilterInstance,
  FilterOptions,
  FilterSettings,
  FilterType,
} from "@/types/filters";
import { filterFactory } from "./FilterFactory";

/**
 * フィルター状態を管理するクラス
 * より型安全で統合的なアプローチを提供
 */
export class FilterStateManager {
  private settings: FilterSettings;

  constructor(
    initialOrder?: FilterType[],
    initialSettings?: Partial<FilterSettings>,
  ) {
    this.settings = {
      states: {},
      order: [],
      options: {},
    };

    this.initializeStates(initialOrder, initialSettings);
  }

  /**
   * フィルター状態を初期化
   */
  private initializeStates(
    customOrder?: FilterType[],
    initialSettings?: Partial<FilterSettings>,
  ): void {
    this.refreshAvailableFilters();

    // フィルター順序を設定
    this.settings.order = customOrder || filterFactory.getDefaultFilterOrder();

    // 初期設定の適用
    if (initialSettings?.states) {
      Object.assign(this.settings.states, initialSettings.states);
    }
    if (initialSettings?.order) {
      this.settings.order = [...initialSettings.order];
    }
    if (initialSettings?.options) {
      Object.assign(this.settings.options, initialSettings.options);
    }
  }

  /**
   * 利用可能なフィルターを更新
   */
  private refreshAvailableFilters(): void {
    const availableFilters = filterFactory.getAvailableFilterTypes();

    // 新しく追加されたフィルターを初期化
    availableFilters.forEach((filterType) => {
      if (!(filterType in this.settings.states)) {
        const config = filterFactory.getFilterConfig(filterType);
        this.settings.states[filterType] = config?.defaultEnabled ?? false;

        // デフォルトオプションを設定
        if (config?.defaultOptions) {
          this.settings.options[filterType] = { ...config.defaultOptions };
        }
      }
    });

    // 削除されたフィルターを除去
    Object.keys(this.settings.states).forEach((filterType) => {
      if (!availableFilters.includes(filterType)) {
        delete this.settings.states[filterType];
        delete this.settings.options[filterType];
      }
    });
  }

  /**
   * フィルターの有効/無効を切り替え
   */
  public toggleFilter(filterType: FilterType): void {
    this.refreshAvailableFilters();

    if (filterType in this.settings.states) {
      this.settings.states[filterType] = !this.settings.states[filterType];
    }
  }

  /**
   * フィルターの状態を設定
   */
  public setFilterEnabled(filterType: FilterType, enabled: boolean): void {
    this.refreshAvailableFilters();

    if (Object.hasOwn(this.settings.states, filterType)) {
      this.settings.states[filterType] = enabled;
    }
  }

  /**
   * フィルターの順序を設定
   */
  public setFilterOrder(newOrder: FilterType[]): void {
    this.settings.order = [...newOrder];
  }

  /**
   * フィルターの順序を変更（上へ）
   */
  public moveFilterUp(filterType: FilterType): void {
    const index = this.settings.order.indexOf(filterType);
    if (index > 0) {
      const newOrder = [...this.settings.order];
      [newOrder[index], newOrder[index - 1]] = [
        newOrder[index - 1],
        newOrder[index],
      ];
      this.settings.order = newOrder;
    }
  }

  /**
   * フィルターの順序を変更（下へ）
   */
  public moveFilterDown(filterType: FilterType): void {
    const index = this.settings.order.indexOf(filterType);
    if (index < this.settings.order.length - 1) {
      const newOrder = [...this.settings.order];
      [newOrder[index], newOrder[index + 1]] = [
        newOrder[index + 1],
        newOrder[index],
      ];
      this.settings.order = newOrder;
    }
  }

  /**
   * フィルターオプションを設定
   */
  public setFilterOptions(
    filterType: FilterType,
    options: FilterOptions,
  ): void {
    this.settings.options[filterType] = { ...options };
  }

  /**
   * フィルター状態を取得
   */
  public getFilterStates() {
    // 最新のフィルターリストを反映
    this.refreshAvailableFilters();
    return { ...this.settings.states };
  }

  /**
   * フィルター順序を取得
   */
  public getFilterOrder(): FilterType[] {
    // 最新のフィルターリストを反映
    this.refreshAvailableFilters();

    // 現在の順序に含まれていない新しいフィルターを追加
    const availableFilters = filterFactory.getAvailableFilterTypes();
    const missingFilters = availableFilters.filter(
      (filter) => !this.settings.order.includes(filter),
    );

    if (missingFilters.length > 0) {
      this.settings.order = [...this.settings.order, ...missingFilters];
    }

    // 削除されたフィルターを順序から除去
    this.settings.order = this.settings.order.filter((filter) =>
      availableFilters.includes(filter),
    );

    return [...this.settings.order];
  }

  /**
   * アクティブなフィルターのリストを取得
   */
  public getActiveFilters(): FilterType[] {
    return this.settings.order.filter(
      (filterType) => this.settings.states[filterType],
    );
  }

  /**
   * フィルターインスタンスのリストを取得
   */
  public getFilterInstances(): FilterInstance[] {
    return this.settings.order.map((filterType, index) => ({
      type: filterType,
      enabled: this.settings.states[filterType],
      order: index,
      options: this.settings.options[filterType] || {},
    }));
  }

  /**
   * 全てのフィルターを無効化
   */
  public disableAllFilters(): void {
    Object.keys(this.settings.states).forEach((filterType) => {
      this.settings.states[filterType] = false;
    });
  }

  /**
   * 特定のフィルターが有効かチェック
   */
  public isFilterEnabled(filterType: FilterType): boolean {
    return this.settings.states[filterType] || false;
  }

  /**
   * 有効なフィルターがあるかチェック
   */
  public hasActiveFilters(): boolean {
    return Object.values(this.settings.states).some((enabled) => enabled);
  }

  /**
   * フィルターオプションを取得
   */
  public getFilterOptions(filterType: FilterType): FilterOptions {
    return this.settings.options[filterType] || {};
  }

  /**
   * 全てのフィルターオプションを取得
   */
  public getAllFilterOptions(): Record<FilterType, FilterOptions> {
    return { ...this.settings.options };
  }

  /**
   * 現在の設定を取得
   */
  public getSettings(): FilterSettings {
    this.refreshAvailableFilters();
    return {
      states: { ...this.settings.states },
      order: [...this.settings.order],
      options: { ...this.settings.options },
    };
  }

  /**
   * 設定をインポート
   */
  public importSettings(newSettings: Partial<FilterSettings>): void {
    if (newSettings.states) {
      Object.assign(this.settings.states, newSettings.states);
    }
    if (newSettings.order) {
      this.settings.order = [...newSettings.order];
    }
    if (newSettings.options) {
      Object.assign(this.settings.options, newSettings.options);
    }
    this.refreshAvailableFilters();
  }
}
