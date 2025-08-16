import { Group, Image } from "@shopify/react-native-skia";
import React from "react";
import { filterFactory } from "@/lib/filters/FilterFactory";
import type { FilterComponentProps, FilterType } from "@/types/filters";

interface FilterRendererProps extends FilterComponentProps {
  filters: FilterType[];
  overlayImageUrl?: string;
  filterOptions?: Record<FilterType, Record<string, any>>;
}

/**
 * フィルターのレンダリングを担当するコンポーネント
 * 動的にフィルターを適用し、順序に従って合成する
 */
const FilterRenderer: React.FC<FilterRendererProps> = ({
  image,
  width,
  height,
  filters,
  overlayImageUrl,
  filterOptions,
}) => {
  const renderFilter = (filterType: FilterType, isFirst: boolean) => {
    const FilterComponent = filterFactory.getFilterComponent(filterType);
    const config = filterFactory.getFilterConfig(filterType);

    if (!FilterComponent || !config) {
      console.warn(`Filter "${filterType}" not found in registry`);
      return null;
    }

    // プロパティを動的に構築
    const baseProps: FilterComponentProps = {
      image,
      width,
      height,
      isBaseLayer: isFirst,
    };

    // オーバーレイフィルターの場合、追加プロパティを設定
    if (filterType === "overlay") {
      const userOptions = filterOptions?.[filterType] || {};
      const overlayProps: OverlayFilterProps = {
        ...baseProps,
        overlayImageUrl,
        blendMode:
          userOptions.blendMode || config.options?.blendMode || "multiply",
        opacity:
          userOptions.opacity !== undefined
            ? userOptions.opacity
            : config.options?.opacity || 0.5,
      };
      return <FilterComponent key={filterType} {...overlayProps} />;
    }

    return <FilterComponent key={filterType} {...baseProps} />;
  };

  return (
    <Group>
      {/* フィルターがない場合はベース画像のみ表示 */}
      {filters.length === 0 && (
        <Image
          image={image}
          x={0}
          y={0}
          width={width}
          height={height}
          fit="cover"
        />
      )}

      {/* フィルターを順序通りに適用 */}
      {filters.length > 0 &&
        filters.map((filterType, index) => {
          const isFirst = index === 0;
          return renderFilter(filterType, isFirst);
        })}
    </Group>
  );
};

export default FilterRenderer;
