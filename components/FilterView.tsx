import {
  Canvas,
  type SkImage,
  useCanvasRef,
  useImage,
} from "@shopify/react-native-skia";
import React, { forwardRef, useImperativeHandle } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import FilterRenderer from "@/components/FilterRenderer";
import type { FilterOptions, FilterType } from "@/types/filters";

interface FilterViewProps {
  imageUrl: string;
  filters: FilterType[];
  overlayImageUrl?: string;
  width?: number;
  height?: number;
  filterOptions?: Record<FilterType, FilterOptions>;
}

export interface FilterViewRef {
  makeImageSnapshot: () => SkImage | null;
}

/**
 * フィルター適用済みの画像を表示するメインビューコンポーネント
 * FilterRendererを使用して動的にフィルターを適用
 */
const FilterView = React.memo(
  forwardRef<FilterViewRef, FilterViewProps>(
    (
      {
        imageUrl,
        filters,
        overlayImageUrl,
        width = 300,
        height = 300,
        filterOptions,
      },
      ref,
    ) => {
      const image = useImage(imageUrl);
      const canvasRef = useCanvasRef();

      useImperativeHandle(
        ref,
        () => ({
          makeImageSnapshot: () => {
            if (canvasRef.current) {
              return canvasRef.current.makeImageSnapshot();
            }
            return null;
          },
        }),
        [canvasRef],
      );

      if (!image) {
        return (
          <View style={[styles.loadingContainer, { width, height }]}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>画像を読み込み中...</Text>
          </View>
        );
      }

      return (
        <View style={styles.container}>
          <View style={styles.canvasContainer}>
            <Canvas ref={canvasRef} style={{ width, height }}>
              <FilterRenderer
                image={image}
                width={width}
                height={height}
                filters={filters}
                overlayImageUrl={overlayImageUrl}
                filterOptions={filterOptions}
              />
            </Canvas>
          </View>
        </View>
      );
    },
  ),
);

FilterView.displayName = "FilterView";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  canvasContainer: {
    borderRadius: 8,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

export default FilterView;
