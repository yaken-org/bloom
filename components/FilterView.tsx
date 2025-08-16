import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { Canvas, useImage, Image, Group } from '@shopify/react-native-skia';
import ImageMagickFilter from '@/hooks/filters/ImageMagickFilter';
import GlitteryFilter from '@/hooks/filters/GlitteryFilter';
import OverlayFilter from '@/hooks/filters/OverlayFilter';

interface FilterViewProps {
  imageUrl: string;
  onFilterApplied?: () => void;
}

const FilterView: React.FC<FilterViewProps> = ({ imageUrl, onFilterApplied }) => {
  const [isFilterEnabled, setIsFilterEnabled] = useState(true);
  const [filterType, setFilterType] = useState<'imagemagick' | 'glittery' | 'overlay'>('imagemagick');
  const [overlayType, setOverlayType] = useState<'vintage' | 'grunge' | 'light' | 'texture'>('vintage');
  const [isLoading, setIsLoading] = useState(true);
  const image = useImage(imageUrl);

  useEffect(() => {
    if (image) {
      setIsLoading(false);
      if (onFilterApplied && isFilterEnabled) {
        onFilterApplied();
      }
    }
  }, [image, onFilterApplied, isFilterEnabled]);

  useEffect(() => {
    setIsLoading(true);
  }, [imageUrl]);

  const canvasWidth = 300;
  const canvasHeight = 225;

  const handleFilterToggle = (value: boolean) => {
    setIsFilterEnabled(value);
    if (value && onFilterApplied) {
      onFilterApplied();
    }
  };

  if (isLoading || !image) {
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
        <Canvas style={{ width: canvasWidth, height: canvasHeight }}>
          <Group>
            {isFilterEnabled ? (
              filterType === 'imagemagick' ? (
                <ImageMagickFilter
                  image={image}
                  width={canvasWidth}
                  height={canvasHeight}
                />
              ) : filterType === 'glittery' ? (
                <GlitteryFilter
                  image={image}
                  width={canvasWidth}
                  height={canvasHeight}
                />
              ) : (
                <OverlayFilter
                  image={image}
                  width={canvasWidth}
                  height={canvasHeight}
                  templateType={overlayType}
                />
              )
            ) : (
              <Image
                image={image}
                x={0}
                y={0}
                width={canvasWidth}
                height={canvasHeight}
                fit="cover"
              />
            )}
          </Group>
        </Canvas>
      </View>
      
      <View style={styles.controls}>
        <Text style={styles.controlLabel}>フィルター適用:</Text>
        <Switch
          value={isFilterEnabled}
          onValueChange={handleFilterToggle}
          trackColor={{ false: '#ccc', true: '#007AFF' }}
          thumbColor={isFilterEnabled ? '#fff' : '#f4f3f4'}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterSelection}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filterType === 'imagemagick' && styles.filterButtonActive
          ]}
          onPress={() => setFilterType('imagemagick')}
        >
          <Text style={[
            styles.filterButtonText,
            filterType === 'imagemagick' && styles.filterButtonTextActive
          ]}>
            ImageMagick風
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            filterType === 'glittery' && styles.filterButtonActive
          ]}
          onPress={() => setFilterType('glittery')}
        >
          <Text style={[
            styles.filterButtonText,
            filterType === 'glittery' && styles.filterButtonTextActive
          ]}>
            ギラギラ
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filterType === 'overlay' && styles.filterButtonActive
          ]}
          onPress={() => setFilterType('overlay')}
        >
          <Text style={[
            styles.filterButtonText,
            filterType === 'overlay' && styles.filterButtonTextActive
          ]}>
            オーバーレイ
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* オーバーレイフィルターのサブ選択 */}
      {filterType === 'overlay' && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.overlaySelection}>
          <TouchableOpacity
            style={[
              styles.overlayButton,
              overlayType === 'vintage' && styles.overlayButtonActive
            ]}
            onPress={() => setOverlayType('vintage')}
          >
            <Text style={[
              styles.overlayButtonText,
              overlayType === 'vintage' && styles.overlayButtonTextActive
            ]}>
              ヴィンテージ
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.overlayButton,
              overlayType === 'grunge' && styles.overlayButtonActive
            ]}
            onPress={() => setOverlayType('grunge')}
          >
            <Text style={[
              styles.overlayButtonText,
              overlayType === 'grunge' && styles.overlayButtonTextActive
            ]}>
              グランジ
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.overlayButton,
              overlayType === 'light' && styles.overlayButtonActive
            ]}
            onPress={() => setOverlayType('light')}
          >
            <Text style={[
              styles.overlayButtonText,
              overlayType === 'light' && styles.overlayButtonTextActive
            ]}>
              ライト効果
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.overlayButton,
              overlayType === 'texture' && styles.overlayButtonActive
            ]}
            onPress={() => setOverlayType('texture')}
          >
            <Text style={[
              styles.overlayButtonText,
              overlayType === 'texture' && styles.overlayButtonTextActive
            ]}>
              テクスチャ
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      <View style={styles.effectsInfo}>
        <Text style={styles.effectsTitle}>
          {filterType === 'imagemagick' ? 'ImageMagick風の効果:' : 
           filterType === 'glittery' ? 'ギラギラフィルターの効果:' : 
           `オーバーレイ効果 (${overlayType}):`}
        </Text>
        <Text style={styles.effectsText}>
          {filterType === 'imagemagick' ? (
            '• Edge Detection (輪郭検出)\n• Negate (色反転)\n• Blur (ぼかし)\n• Modulate (彩度強化)\n• Colorize (着色)'
          ) : filterType === 'glittery' ? (
            '• 超高彩度 (Hyper Saturation)\n• メタリック効果 (Metallic)\n• ゴールド効果 (Gold)\n• シャープネス強化 (Sharp)\n• ハイライト強調 (Highlight)\n• 高コントラスト (High Contrast)'
          ) : overlayType === 'vintage' ? (
            '• セピア調の色味\n• 古い写真風のテクスチャ\n• 暖かみのある色調\n• ヴィンテージ感の演出'
          ) : overlayType === 'grunge' ? (
            '• グレースケールテクスチャ\n• 高コントラスト効果\n• ラフな質感\n• モノクロ調のオーバーレイ'
          ) : overlayType === 'light' ? (
            '• 明るいライト効果\n• 柔らかな光のオーバーレイ\n• 透明度の高い合成\n• 幻想的な雰囲気'
          ) : (
            '• テクスチャパターン\n• グレーベースの質感\n• 素材感の追加\n• 立体的な効果'
          )}
        </Text>
      </View>
    </View>
  );
};

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
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  controlLabel: {
    fontSize: 16,
    marginRight: 10,
    color: '#333',
  },
  effectsInfo: {
    marginTop: 15,
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    width: 300,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  effectsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
  },
  effectsText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  filterSelection: {
    flexDirection: 'row',
    marginTop: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    paddingHorizontal: 5,
  },
  filterButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderRadius: 6,
    marginHorizontal: 2,
    minWidth: 100,
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  filterButtonTextActive: {
    color: 'white',
  },
  overlaySelection: {
    flexDirection: 'row',
    marginTop: 8,
    backgroundColor: '#f8f8f8',
    borderRadius: 6,
    paddingHorizontal: 5,
  },
  overlayButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderRadius: 4,
    marginHorizontal: 2,
    minWidth: 80,
  },
  overlayButtonActive: {
    backgroundColor: '#34C759',
  },
  overlayButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#888',
  },
  overlayButtonTextActive: {
    color: 'white',
  },
});

export default FilterView;