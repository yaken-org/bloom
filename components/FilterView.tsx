import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { Canvas, useImage, Image, Group } from '@shopify/react-native-skia';
import ImageMagickFilter from '@/hooks/filters/ImageMagickFilter';
import GlitteryFilter from '@/hooks/filters/GlitteryFilter';
import OverlayFilter from '@/hooks/filters/OverlayFilter';

interface FilterState {
  imageMagick: boolean;
  glittery: boolean;
  overlay: boolean;
}

type FilterType = 'overlay' | 'imageMagick' | 'glittery';

interface FilterViewProps {
  imageUrl: string;
  onFilterApplied?: () => void;
}

const FilterView: React.FC<FilterViewProps> = ({ imageUrl, onFilterApplied }) => {
  const [filterStates, setFilterStates] = useState<FilterState>({
    imageMagick: false,
    glittery: false,
    overlay: false,
  });
  const [overlayType, setOverlayType] = useState<'vintage' | 'grunge' | 'light' | 'texture'>('vintage');
  const [isLoading, setIsLoading] = useState(true);
  const [filterOrder, setFilterOrder] = useState<FilterType[]>(['overlay', 'imageMagick', 'glittery']);
  const image = useImage(imageUrl);

  useEffect(() => {
    if (image) {
      setIsLoading(false);
      if (onFilterApplied && Object.values(filterStates).some(state => state)) {
        onFilterApplied();
      }
    }
  }, [image, onFilterApplied, filterStates]);

  useEffect(() => {
    setIsLoading(true);
  }, [imageUrl]);

  const canvasWidth = 300;
  const canvasHeight = 225;

  const toggleFilter = (filterName: keyof FilterState) => {
    setFilterStates(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  const hasAnyFilterEnabled = Object.values(filterStates).some(state => state);

  const moveFilterUp = (index: number) => {
    if (index > 0) {
      const newOrder = [...filterOrder];
      [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
      setFilterOrder(newOrder);
    }
  };

  const moveFilterDown = (index: number) => {
    if (index < filterOrder.length - 1) {
      const newOrder = [...filterOrder];
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
      setFilterOrder(newOrder);
    }
  };

  const renderFilter = (filterType: FilterType, isFirst: boolean) => {
    const isActive = filterStates[filterType];
    if (!isActive || !image) return null;

    switch (filterType) {
      case 'overlay':
        return (
          <OverlayFilter
            key="overlay"
            image={image}
            width={canvasWidth}
            height={canvasHeight}
            templateType={overlayType}
            isBaseLayer={isFirst}
          />
        );
      case 'imageMagick':
        return (
          <ImageMagickFilter
            key="imageMagick"
            image={image}
            width={canvasWidth}
            height={canvasHeight}
            isBaseLayer={isFirst}
          />
        );
      case 'glittery':
        return (
          <GlitteryFilter
            key="glittery"
            image={image}
            width={canvasWidth}
            height={canvasHeight}
            isBaseLayer={isFirst}
          />
        );
      default:
        return null;
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
            {/* フィルターが無効な場合はベース画像のみ表示 */}
            {!hasAnyFilterEnabled && image && (
              <Image
                image={image}
                x={0}
                y={0}
                width={canvasWidth}
                height={canvasHeight}
                fit="cover"
              />
            )}
            
            {/* フィルターを順序通りに適用 */}
            {hasAnyFilterEnabled && (() => {
              const activeFilters = filterOrder.filter(filter => filterStates[filter]);
              let needsBaseImage = true;
              
              return activeFilters.map((filterType, index) => {
                const isFirst = needsBaseImage;
                if (isFirst) needsBaseImage = false;
                return renderFilter(filterType, isFirst);
              });
            })()}
          </Group>
        </Canvas>
      </View>
      
      <View style={styles.controls}>
        <Text style={styles.controlLabel}>フィルター全体の適用:</Text>
        <Switch
          value={hasAnyFilterEnabled}
          onValueChange={(value) => {
            if (!value) {
              // 全て無効化
              setFilterStates({
                imageMagick: false,
                glittery: false,
                overlay: false,
              });
            } else {
              // デフォルトでImageMagickフィルターを有効化
              setFilterStates(prev => ({
                ...prev,
                imageMagick: true,
              }));
            }
          }}
          trackColor={{ false: '#ccc', true: '#007AFF' }}
          thumbColor={hasAnyFilterEnabled ? '#fff' : '#f4f3f4'}
        />
      </View>

      <Text style={styles.sectionTitle}>個別フィルター設定</Text>

      <View style={styles.filterToggleContainer}>
        <View style={styles.filterToggleRow}>
          <Text style={styles.filterToggleLabel}>ImageMagick風</Text>
          <Switch
            value={filterStates.imageMagick}
            onValueChange={() => toggleFilter('imageMagick')}
            trackColor={{ false: '#ccc', true: '#007AFF' }}
            thumbColor={filterStates.imageMagick ? '#fff' : '#f4f3f4'}
          />
        </View>
        
        <View style={styles.filterToggleRow}>
          <Text style={styles.filterToggleLabel}>ギラギラ</Text>
          <Switch
            value={filterStates.glittery}
            onValueChange={() => toggleFilter('glittery')}
            trackColor={{ false: '#ccc', true: '#34C759' }}
            thumbColor={filterStates.glittery ? '#fff' : '#f4f3f4'}
          />
        </View>

        <View style={styles.filterToggleRow}>
          <Text style={styles.filterToggleLabel}>オーバーレイ</Text>
          <Switch
            value={filterStates.overlay}
            onValueChange={() => toggleFilter('overlay')}
            trackColor={{ false: '#ccc', true: '#FF9500' }}
            thumbColor={filterStates.overlay ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* フィルター順序の設定 */}
      {hasAnyFilterEnabled && (
        <>
          <Text style={styles.sectionTitle}>フィルターの適用順序</Text>
          
          <View style={styles.orderContainer}>
            {filterOrder.map((filterType, index) => {
              const isActive = filterStates[filterType];
              const filterNames = {
                overlay: 'オーバーレイ',
                imageMagick: 'ImageMagick風',
                glittery: 'ギラギラ'
              };
              
              return (
                <View key={filterType} style={[
                  styles.orderItem,
                  !isActive && styles.orderItemInactive
                ]}>
                  <View style={styles.orderItemLeft}>
                    <Text style={styles.orderNumber}>{index + 1}</Text>
                    <Text style={[
                      styles.orderItemText,
                      !isActive && styles.orderItemTextInactive
                    ]}>
                      {filterNames[filterType]}
                    </Text>
                    {!isActive && (
                      <Text style={styles.inactiveLabel}>(無効)</Text>
                    )}
                  </View>
                  
                  <View style={styles.orderControls}>
                    <TouchableOpacity
                      style={[
                        styles.orderButton,
                        index === 0 && styles.orderButtonDisabled
                      ]}
                      onPress={() => moveFilterUp(index)}
                      disabled={index === 0}
                    >
                      <Text style={[
                        styles.orderButtonText,
                        index === 0 && styles.orderButtonTextDisabled
                      ]}>↑</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[
                        styles.orderButton,
                        index === filterOrder.length - 1 && styles.orderButtonDisabled
                      ]}
                      onPress={() => moveFilterDown(index)}
                      disabled={index === filterOrder.length - 1}
                    >
                      <Text style={[
                        styles.orderButtonText,
                        index === filterOrder.length - 1 && styles.orderButtonTextDisabled
                      ]}>↓</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        </>
      )}

      {/* オーバーレイフィルターのサブ選択 */}
      {filterStates.overlay && (
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
        <Text style={styles.effectsTitle}>適用中の効果:</Text>
        <Text style={styles.effectsText}>
          {!hasAnyFilterEnabled ? (
            'フィルターが適用されていません'
          ) : (
            (() => {
              const activeFilters = filterOrder.filter(filter => filterStates[filter]);
              const filterNames = {
                overlay: `オーバーレイ効果 (${overlayType})`,
                imageMagick: 'ImageMagick風の効果 (エッジ検出、色反転、彩度強化等)',
                glittery: 'ギラギラフィルター (超高彩度、メタリック効果等)'
              };
              
              return activeFilters.map(filter => `• ${filterNames[filter]}`).join('\n') + '\n';
            })()
          )}
        </Text>
        
        {hasAnyFilterEnabled && (() => {
          const activeFilters = filterOrder.filter(filter => filterStates[filter]);
          const filterNames = {
            overlay: 'オーバーレイ',
            imageMagick: 'ImageMagick風',
            glittery: 'ギラギラ'
          };
          
          return (
            <Text style={styles.layerOrderInfo}>
              ※ フィルターは「{activeFilters.map(filter => filterNames[filter]).join(' → ')}」の順で重ねて適用されます
            </Text>
          );
        })()}
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  filterToggleContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    width: 300,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginBottom: 15,
  },
  filterToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  filterToggleLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
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
  layerOrderInfo: {
    fontSize: 11,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 8,
    lineHeight: 16,
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
  orderContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    width: 300,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginBottom: 15,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  orderItemInactive: {
    opacity: 0.5,
  },
  orderItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  orderNumber: {
    width: 24,
    height: 24,
    backgroundColor: '#007AFF',
    color: 'white',
    textAlign: 'center',
    lineHeight: 24,
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 10,
  },
  orderItemText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  orderItemTextInactive: {
    color: '#999',
  },
  inactiveLabel: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginLeft: 8,
  },
  orderControls: {
    flexDirection: 'row',
    gap: 5,
  },
  orderButton: {
    width: 32,
    height: 32,
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderButtonDisabled: {
    backgroundColor: '#f8f8f8',
  },
  orderButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  orderButtonTextDisabled: {
    color: '#ccc',
  },
});

export default FilterView;