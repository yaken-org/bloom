import React, { useState, useCallback } from 'react';
import type { FilterType, FilterState } from '@/types/filters';
import { FilterStateManager } from '@/lib/filters/FilterStateManager';

interface UseFilterStateReturn {
  filterStates: FilterState;
  filterOrder: FilterType[];
  activeFilters: FilterType[];
  toggleFilter: (filterType: FilterType) => void;
  setFilterOrder: (newOrder: FilterType[]) => void;
  moveFilterUp: (filterType: FilterType) => void;
  moveFilterDown: (filterType: FilterType) => void;
  disableAllFilters: () => void;
  hasActiveFilters: boolean;
  isFilterEnabled: (filterType: FilterType) => boolean;
  setFilterOptions: (filterType: FilterType, options: Record<string, any>) => void;
  getFilterOptions: (filterType: FilterType) => Record<string, any>;
  getAllFilterOptions: () => Record<FilterType, Record<string, any>>;
}

/**
 * フィルター状態を管理するカスタムフック
 */
export const useFilterState = (initialOrder?: FilterType[]): UseFilterStateReturn => {
  const [stateManager] = useState(() => new FilterStateManager(initialOrder));
  const [filterStates, setFilterStates] = useState<FilterState>(stateManager.getFilterStates());
  const [filterOrder, setFilterOrderState] = useState<FilterType[]>(stateManager.getFilterOrder());

  const updateStates = useCallback(() => {
    setFilterStates(stateManager.getFilterStates());
    setFilterOrderState(stateManager.getFilterOrder());
  }, [stateManager]);

  const toggleFilter = useCallback((filterType: FilterType) => {
    stateManager.toggleFilter(filterType);
    updateStates();
  }, [stateManager, updateStates]);

  const setFilterOrder = useCallback((newOrder: FilterType[]) => {
    stateManager.setFilterOrder(newOrder);
    updateStates();
  }, [stateManager, updateStates]);

  const moveFilterUp = useCallback((filterType: FilterType) => {
    stateManager.moveFilterUp(filterType);
    updateStates();
  }, [stateManager, updateStates]);

  const moveFilterDown = useCallback((filterType: FilterType) => {
    stateManager.moveFilterDown(filterType);
    updateStates();
  }, [stateManager, updateStates]);

  const disableAllFilters = useCallback(() => {
    stateManager.disableAllFilters();
    updateStates();
  }, [stateManager, updateStates]);

  const isFilterEnabled = useCallback((filterType: FilterType) => {
    return stateManager.isFilterEnabled(filterType);
  }, [stateManager]);

  const setFilterOptions = useCallback((filterType: FilterType, options: Record<string, any>) => {
    stateManager.setFilterOptions(filterType, options);
    updateStates();
  }, [stateManager, updateStates]);

  const getFilterOptions = useCallback((filterType: FilterType) => {
    return stateManager.getFilterOptions(filterType);
  }, [stateManager]);

  const getAllFilterOptions = useCallback(() => {
    return stateManager.getAllFilterOptions();
  }, [stateManager]);

  // 状態の更新時に再計算されるようにuseMemoを使用
  const activeFilters = React.useMemo(() => {
    return filterOrder.filter(filterType => filterStates[filterType]);
  }, [filterOrder, filterStates]);

  const hasActiveFilters = React.useMemo(() => {
    return Object.values(filterStates).some(enabled => enabled);
  }, [filterStates]);

  return {
    filterStates,
    filterOrder,
    activeFilters,
    toggleFilter,
    setFilterOrder,
    moveFilterUp,
    moveFilterDown,
    disableAllFilters,
    hasActiveFilters,
    isFilterEnabled,
    setFilterOptions,
    getFilterOptions,
    getAllFilterOptions,
  };
};
