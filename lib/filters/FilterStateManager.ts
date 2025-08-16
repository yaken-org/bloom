import type { FilterType, FilterState, FilterInstance } from '@/types/filters';
import { filterFactory } from './FilterFactory';

/**
 * フィルター状態を管理するクラス
 */
export class FilterStateManager {
  private filterStates: FilterState = {};
  private filterOrder: FilterType[] = [];
  private filterOptions: Record<FilterType, Record<string, any>> = {};

  constructor(initialOrder?: FilterType[]) {
    this.initializeStates(initialOrder);
  }

  /**
   * フィルター状態を初期化
   */
  private initializeStates(customOrder?: FilterType[]): void {
    this.refreshAvailableFilters();
    
    // フィルター順序を設定
    this.filterOrder = customOrder || filterFactory.getDefaultFilterOrder();
  }

  /**
   * 利用可能なフィルターを更新
   */
  private refreshAvailableFilters(): void {
    const availableFilters = filterFactory.getAvailableFilterTypes();
    
    // 新しく追加されたフィルターを初期化
    availableFilters.forEach(filterType => {
      if (!(filterType in this.filterStates)) {
        const config = filterFactory.getFilterConfig(filterType);
        this.filterStates[filterType] = config?.defaultEnabled ?? false;
      }
    });

    // 削除されたフィルターを除去
    Object.keys(this.filterStates).forEach(filterType => {
      if (!availableFilters.includes(filterType)) {
        delete this.filterStates[filterType];
      }
    });
  }

  /**
   * フィルターの有効/無効を切り替え
   */
  public toggleFilter(filterType: FilterType): void {
    this.refreshAvailableFilters();
    
    if (this.filterStates.hasOwnProperty(filterType)) {
      this.filterStates[filterType] = !this.filterStates[filterType];
    }
  }

  /**
   * フィルターの状態を設定
   */
  public setFilterEnabled(filterType: FilterType, enabled: boolean): void {
    if (this.filterStates.hasOwnProperty(filterType)) {
      this.filterStates[filterType] = enabled;
    }
  }

  /**
   * フィルターの順序を設定
   */
  public setFilterOrder(newOrder: FilterType[]): void {
    this.filterOrder = [...newOrder];
  }

  /**
   * フィルターの順序を変更（上へ）
   */
  public moveFilterUp(filterType: FilterType): void {
    const index = this.filterOrder.indexOf(filterType);
    if (index > 0) {
      const newOrder = [...this.filterOrder];
      [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
      this.filterOrder = newOrder;
    }
  }

  /**
   * フィルターの順序を変更（下へ）
   */
  public moveFilterDown(filterType: FilterType): void {
    const index = this.filterOrder.indexOf(filterType);
    if (index < this.filterOrder.length - 1) {
      const newOrder = [...this.filterOrder];
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
      this.filterOrder = newOrder;
    }
  }

  /**
   * フィルターオプションを設定
   */
  public setFilterOptions(filterType: FilterType, options: Record<string, any>): void {
    this.filterOptions[filterType] = { ...options };
  }

  /**
   * フィルター状態を取得
   */
  public getFilterStates(): FilterState {
    // 最新のフィルターリストを反映
    this.refreshAvailableFilters();
    return { ...this.filterStates };
  }

  /**
   * フィルター順序を取得
   */
  public getFilterOrder(): FilterType[] {
    // 最新のフィルターリストを反映
    this.refreshAvailableFilters();
    
    // 現在の順序に含まれていない新しいフィルターを追加
    const availableFilters = filterFactory.getAvailableFilterTypes();
    const missingFilters = availableFilters.filter(filter => !this.filterOrder.includes(filter));
    
    if (missingFilters.length > 0) {
      this.filterOrder = [...this.filterOrder, ...missingFilters];
    }
    
    // 削除されたフィルターを順序から除去
    this.filterOrder = this.filterOrder.filter(filter => availableFilters.includes(filter));
    
    return [...this.filterOrder];
  }

  /**
   * アクティブなフィルターのリストを取得
   */
  public getActiveFilters(): FilterType[] {
    return this.filterOrder.filter(filterType => this.filterStates[filterType]);
  }

  /**
   * フィルターインスタンスのリストを取得
   */
  public getFilterInstances(): FilterInstance[] {
    return this.filterOrder.map((filterType, index) => ({
      type: filterType,
      enabled: this.filterStates[filterType],
      order: index,
      options: this.filterOptions[filterType] || {}
    }));
  }

  /**
   * 全てのフィルターを無効化
   */
  public disableAllFilters(): void {
    Object.keys(this.filterStates).forEach(filterType => {
      this.filterStates[filterType] = false;
    });
  }

  /**
   * 特定のフィルターが有効かチェック
   */
  public isFilterEnabled(filterType: FilterType): boolean {
    return this.filterStates[filterType] || false;
  }

  /**
   * 有効なフィルターがあるかチェック
   */
  public hasActiveFilters(): boolean {
    return Object.values(this.filterStates).some(enabled => enabled);
  }

  /**
   * フィルターオプションを取得
   */
  public getFilterOptions(filterType: FilterType): Record<string, any> {
    return this.filterOptions[filterType] || {};
  }

  /**
   * 全てのフィルターオプションを取得
   */
  public getAllFilterOptions(): Record<FilterType, Record<string, any>> {
    return { ...this.filterOptions };
  }
}
