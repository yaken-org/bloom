import { useCallback, useMemo, useState } from "react";
import { FilterStateManager } from "@/lib/filters/FilterStateManager";
import type {
  FilterInstance,
  FilterOptions,
  FilterSettings,
  FilterType,
} from "@/types/filters";

/**
 * フィルター管理の統合フック
 * useFilterStateとuseFilterConfigを統合し、より使いやすいAPIを提供
 */
export interface UseFiltersReturn {
  // 基本状態
  settings: FilterSettings;
  activeFilters: FilterType[];
  hasActiveFilters: boolean;

  // フィルター操作
  toggleFilter: (filterType: FilterType) => void;
  setFilterEnabled: (filterType: FilterType, enabled: boolean) => void;
  resetFilters: () => void;

  // 順序操作
  reorderFilters: (newOrder: FilterType[]) => void;
  moveFilterUp: (filterType: FilterType) => void;
  moveFilterDown: (filterType: FilterType) => void;

  // オプション操作
  setFilterOptions: (
    filterType: FilterType,
    options: Partial<FilterOptions>,
  ) => void;
  getFilterOptions: (filterType: FilterType) => FilterOptions;
  updateFilterOption: <K extends keyof FilterOptions>(
    filterType: FilterType,
    key: K,
    value: FilterOptions[K],
  ) => void;

  // ユーティリティ
  isFilterEnabled: (filterType: FilterType) => boolean;
  getFilterInstances: () => FilterInstance[];
  exportSettings: () => FilterSettings;
  importSettings: (settings: Partial<FilterSettings>) => void;
}

export const useFilters = (
  initialOrder?: FilterType[],
  initialSettings?: Partial<FilterSettings>,
): UseFiltersReturn => {
  // ステートマネージャーのインスタンス化
  const [manager] = useState(() => {
    const mgr = new FilterStateManager(initialOrder);

    // 初期設定の適用
    if (initialSettings) {
      if (initialSettings.states) {
        Object.entries(initialSettings.states).forEach(([type, enabled]) => {
          mgr.setFilterEnabled(type, enabled);
        });
      }
      if (initialSettings.order) {
        mgr.setFilterOrder(initialSettings.order);
      }
      if (initialSettings.options) {
        Object.entries(initialSettings.options).forEach(([type, options]) => {
          mgr.setFilterOptions(type, options);
        });
      }
    }

    return mgr;
  });

  // 再レンダリングトリガー用の状態
  const [updateTrigger, setUpdateTrigger] = useState(0);

  // 状態更新用のコールバック
  const triggerUpdate = useCallback(() => {
    setUpdateTrigger((prev) => prev + 1);
  }, []);

  // 現在の設定を取得（メモ化）
  const settings = useMemo(
    (): FilterSettings => ({
      states: manager.getFilterStates(),
      order: manager.getFilterOrder(),
      options: manager.getAllFilterOptions(),
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }),
    [manager, updateTrigger],
  );

  // アクティブフィルターの計算（メモ化）
  const activeFilters = useMemo(() => {
    return settings.order.filter((type) => settings.states[type]);
  }, [settings.states, settings.order]);

  // アクティブフィルターの存在チェック（メモ化）
  const hasActiveFilters = useMemo(() => {
    return activeFilters.length > 0;
  }, [activeFilters]);

  // フィルター操作関数
  const toggleFilter = useCallback(
    (filterType: FilterType) => {
      manager.toggleFilter(filterType);
      triggerUpdate();
    },
    [manager, triggerUpdate],
  );

  const setFilterEnabled = useCallback(
    (filterType: FilterType, enabled: boolean) => {
      manager.setFilterEnabled(filterType, enabled);
      triggerUpdate();
    },
    [manager, triggerUpdate],
  );

  const resetFilters = useCallback(() => {
    manager.disableAllFilters();
    triggerUpdate();
  }, [manager, triggerUpdate]);

  // 順序操作関数
  const reorderFilters = useCallback(
    (newOrder: FilterType[]) => {
      manager.setFilterOrder(newOrder);
      triggerUpdate();
    },
    [manager, triggerUpdate],
  );

  const moveFilterUp = useCallback(
    (filterType: FilterType) => {
      manager.moveFilterUp(filterType);
      triggerUpdate();
    },
    [manager, triggerUpdate],
  );

  const moveFilterDown = useCallback(
    (filterType: FilterType) => {
      manager.moveFilterDown(filterType);
      triggerUpdate();
    },
    [manager, triggerUpdate],
  );

  // オプション操作関数
  const setFilterOptions = useCallback(
    (filterType: FilterType, options: Partial<FilterOptions>) => {
      const currentOptions = manager.getFilterOptions(filterType);
      const mergedOptions = { ...currentOptions, ...options };
      manager.setFilterOptions(filterType, mergedOptions);
      triggerUpdate();
    },
    [manager, triggerUpdate],
  );

  const getFilterOptions = useCallback(
    (filterType: FilterType): FilterOptions => {
      return manager.getFilterOptions(filterType);
    },
    [manager],
  );

  const updateFilterOption = useCallback(
    <K extends keyof FilterOptions>(
      filterType: FilterType,
      key: K,
      value: FilterOptions[K],
    ) => {
      const currentOptions = manager.getFilterOptions(filterType);
      const updatedOptions = { ...currentOptions, [key]: value };
      manager.setFilterOptions(filterType, updatedOptions);
      triggerUpdate();
    },
    [manager, triggerUpdate],
  );

  // ユーティリティ関数
  const isFilterEnabled = useCallback(
    (filterType: FilterType) => {
      return manager.isFilterEnabled(filterType);
    },
    [manager],
  );

  const getFilterInstances = useCallback((): FilterInstance[] => {
    return manager.getFilterInstances();
  }, [manager]);

  const exportSettings = useCallback((): FilterSettings => {
    return {
      states: manager.getFilterStates(),
      order: manager.getFilterOrder(),
      options: manager.getAllFilterOptions(),
    };
  }, [manager]);

  const importSettings = useCallback(
    (newSettings: Partial<FilterSettings>) => {
      if (newSettings.states) {
        Object.entries(newSettings.states).forEach(([type, enabled]) => {
          manager.setFilterEnabled(type, enabled);
        });
      }
      if (newSettings.order) {
        manager.setFilterOrder(newSettings.order);
      }
      if (newSettings.options) {
        Object.entries(newSettings.options).forEach(([type, options]) => {
          manager.setFilterOptions(type, options);
        });
      }
      triggerUpdate();
    },
    [manager, triggerUpdate],
  );

  return {
    settings,
    activeFilters,
    hasActiveFilters,

    toggleFilter,
    setFilterEnabled,
    resetFilters,

    reorderFilters,
    moveFilterUp,
    moveFilterDown,

    setFilterOptions,
    getFilterOptions,
    updateFilterOption,

    isFilterEnabled,
    getFilterInstances,
    exportSettings,
    importSettings,
  };
};

export default useFilters;
