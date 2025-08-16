import React, { forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { Canvas, useImage, Image, Group, SkImage, useCanvasRef } from '@shopify/react-native-skia';
import ImageMagickFilter from '@/components/filters/ImageMagickFilter';
import GlitteryFilter from '@/components/filters/GlitteryFilter';
import OverlayFilter from '@/components/filters/OverlayFilter';
import type { FilterType } from '@/types/filters';

interface FilterViewProps {
  imageUrl: string;
  filters: FilterType[];
  overlayImageUrl?: string;
  width?: number;
  height?: number;
}

export interface FilterViewRef {
  makeImageSnapshot: () => SkImage | null;
}

const FilterView = forwardRef<FilterViewRef, FilterViewProps>(({ 
  imageUrl, 
  filters, 
  overlayImageUrl,
  width = 300,
  height = 225
}, ref) => {
  const image = useImage(imageUrl);
  const canvasRef = useCanvasRef();

  useImperativeHandle(ref, () => ({
    makeImageSnapshot: () => {
      if (canvasRef.current) {
        return canvasRef.current.makeImageSnapshot();
      }
      return null;
    }
  }));

  const renderFilter = (filterType: FilterType, isFirst: boolean) => {
    if (!image) return null;

    switch (filterType) {
      case 'overlay':
        return (
          <OverlayFilter
            key="overlay"
            image={image}
            width={width}
            height={height}
            overlayImageUrl={overlayImageUrl}
            blendMode="multiply"
            opacity={0.6}
            isBaseLayer={isFirst}
          />
        );
      case 'imageMagick':
        return (
          <ImageMagickFilter
            key="imageMagick"
            image={image}
            width={width}
            height={height}
            isBaseLayer={isFirst}
          />
        );
      case 'glittery':
        return (
          <GlitteryFilter
            key="glittery"
            image={image}
            width={width}
            height={height}
            isBaseLayer={isFirst}
          />
        );
      default:
        return null;
    }
  };

  if (!image) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>画像を読み込み中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.canvasContainer}>
        <Canvas ref={canvasRef} style={{ width, height }}>
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
              })
            }
          </Group>
        </Canvas>
      </View>
    </View>
  );
});

FilterView.displayName = 'FilterView';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  loadingContainer: {
    width: 300,
    height: 225,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  canvasContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

export default FilterView;