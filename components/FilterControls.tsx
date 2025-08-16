import React from 'react';
import { View, StyleSheet, Text, Switch, TouchableOpacity } from 'react-native';
import type { FilterType, FilterState } from '@/types/filters';

interface FilterControlsProps {
  filterStates: FilterState;
  filterOrder: FilterType[];
  overlayImageUrl: string | null;
  onToggleFilter: (filterType: keyof FilterState) => void;
  onReorderFilter: (filterOrder: FilterType[]) => void;
  onSelectOverlayImage: () => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  filterStates,
  filterOrder,
  overlayImageUrl,
  onToggleFilter,
  onReorderFilter,
  onSelectOverlayImage,
}) => {
  const hasAnyFilterEnabled = Object.values(filterStates).some(state => state);

  const moveFilterUp = (index: number) => {
    if (index > 0) {
      const newOrder = [...filterOrder];
      [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
      onReorderFilter(newOrder);
    }
  };

  const moveFilterDown = (index: number) => {
    if (index < filterOrder.length - 1) {
      const newOrder = [...filterOrder];
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
      onReorderFilter(newOrder);
    }
  };

  const handleToggleAll = (value: boolean) => {
    if (!value) {
      // 全て無効化
      onToggleFilter('imageMagick');
      onToggleFilter('glittery');
      onToggleFilter('overlay');
    } else {
      // ImageMagickフィルターを有効化
      if (!filterStates.imageMagick) {
        onToggleFilter('imageMagick');
      }
    }
  };

  const filterNames = {
    overlay: 'オーバーレイ',
    imageMagick: 'ImageMagick風',
    glittery: 'ギラギラ'
  };

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <Text style={styles.controlLabel}>フィルター全体の適用:</Text>
        <Switch
          value={hasAnyFilterEnabled}
          onValueChange={handleToggleAll}
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
            onValueChange={() => onToggleFilter('imageMagick')}
            trackColor={{ false: '#ccc', true: '#007AFF' }}
            thumbColor={filterStates.imageMagick ? '#fff' : '#f4f3f4'}
          />
        </View>
        
        <View style={styles.filterToggleRow}>
          <Text style={styles.filterToggleLabel}>ギラギラ</Text>
          <Switch
            value={filterStates.glittery}
            onValueChange={() => onToggleFilter('glittery')}
            trackColor={{ false: '#ccc', true: '#34C759' }}
            thumbColor={filterStates.glittery ? '#fff' : '#f4f3f4'}
          />
        </View>

        <View style={styles.filterToggleRow}>
          <Text style={styles.filterToggleLabel}>オーバーレイ</Text>
          <Switch
            value={filterStates.overlay}
            onValueChange={() => onToggleFilter('overlay')}
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

      {/* オーバーレイ画像の選択 */}
      {filterStates.overlay && (
        <>
          <Text style={styles.sectionTitle}>オーバーレイ画像</Text>
          <View style={styles.overlayImageSection}>
            <TouchableOpacity
              style={styles.selectImageButton}
              onPress={onSelectOverlayImage}
            >
              <Text style={styles.selectImageButtonText}>
                {overlayImageUrl ? 'オーバーレイ画像を変更' : 'オーバーレイ画像を選択'}
              </Text>
            </TouchableOpacity>
            {overlayImageUrl && (
              <Text style={styles.imageSelectedText}>✓ 画像が選択されています</Text>
            )}
          </View>
        </>
      )}

      <View style={styles.effectsInfo}>
        <Text style={styles.effectsTitle}>適用中の効果:</Text>
        <Text style={styles.effectsText}>
          {!hasAnyFilterEnabled ? (
            'フィルターが適用されていません'
          ) : (
            (() => {
              const activeFilters = filterOrder.filter(filter => filterStates[filter]);
              const filterDescriptions = {
                overlay: 'オーバーレイ効果',
                imageMagick: 'ImageMagick風の効果 (エッジ検出、色反転、彩度強化等)',
                glittery: 'ギラギラフィルター (超高彩度、メタリック効果等)'
              };
              
              return activeFilters.map(filter => `• ${filterDescriptions[filter]}`).join('\n') + '\n';
            })()
          )}
        </Text>
        
        {hasAnyFilterEnabled && (() => {
          const activeFilters = filterOrder.filter(filter => filterStates[filter]);
          
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
    width: '100%',
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
  overlaySelection: {
    flexDirection: 'row',
    marginTop: 8,
    backgroundColor: '#f8f8f8',
    borderRadius: 6,
    paddingHorizontal: 5,
    marginBottom: 15,
  },
  overlayImageSection: {
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
    alignItems: 'center',
  },
  selectImageButton: {
    backgroundColor: '#FF9500',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  selectImageButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  imageSelectedText: {
    fontSize: 14,
    color: '#34C759',
    fontWeight: '500',
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
    backgroundColor: '#FF9500',
  },
  overlayButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#888',
  },
  overlayButtonTextActive: {
    color: 'white',
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
});

export default FilterControls;
