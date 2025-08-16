import React, { useCallback } from "react";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { filterFactory } from "@/lib/filters/FilterFactory";
import type {
  FilterOptions,
  FilterSettings,
  FilterType,
} from "@/types/filters";

interface FilterControlsProps {
  settings: FilterSettings;
  activeFilters: FilterType[];
  hasActiveFilters: boolean;
  overlayImageUrl?: string | null;
  onToggleFilter: (filterType: FilterType) => void;
  onReorderFilter: (newOrder: FilterType[]) => void;
  onSelectOverlayImage?: () => void;
  onSetFilterOptions?: (
    filterType: FilterType,
    options: Partial<FilterOptions>,
  ) => void;
  onGetFilterOptions?: (filterType: FilterType) => FilterOptions;
}

/**
 * 拡張可能なフィルターコントロールコンポーネント
 * FilterFactoryから動的にフィルター情報を取得して表示
 */
const FilterControls: React.FC<FilterControlsProps> = React.memo(
  ({
    settings,
    activeFilters,
    hasActiveFilters,
    overlayImageUrl,
    onToggleFilter,
    onReorderFilter,
    onSelectOverlayImage,
    onSetFilterOptions,
    onGetFilterOptions,
  }) => {
    const allConfigs = filterFactory.getAllFilterConfigs();

    const moveFilterUp = useCallback(
      (index: number) => {
        if (index > 0) {
          const newOrder = [...settings.order];
          [newOrder[index], newOrder[index - 1]] = [
            newOrder[index - 1],
            newOrder[index],
          ];
          onReorderFilter(newOrder);
        }
      },
      [settings.order, onReorderFilter],
    );

    const moveFilterDown = useCallback(
      (index: number) => {
        if (index < settings.order.length - 1) {
          const newOrder = [...settings.order];
          [newOrder[index], newOrder[index + 1]] = [
            newOrder[index + 1],
            newOrder[index],
          ];
          onReorderFilter(newOrder);
        }
      },
      [settings.order, onReorderFilter],
    );

    const handleToggleAll = useCallback(
      (value: boolean) => {
        if (!value) {
          // 全て無効化
          allConfigs.forEach((config) => {
            if (settings.states[config.type]) {
              onToggleFilter(config.type);
            }
          });
        } else {
          // 最初のフィルターを有効化（後方互換性のため）
          const firstFilter =
            allConfigs.find((config) => config.type === "imageMagick") ||
            allConfigs[0];
          if (firstFilter && !settings.states[firstFilter.type]) {
            onToggleFilter(firstFilter.type);
          }
        }
      },
      [allConfigs, settings.states, onToggleFilter],
    );

    // シンプルなスライダーコンポーネント
    const SimpleSlider: React.FC<{
      value: number;
      onValueChange: (value: number) => void;
      minimumValue?: number;
      maximumValue?: number;
      step?: number;
    }> = React.memo(
      ({
        value,
        onValueChange,
        minimumValue = 0,
        maximumValue = 1,
        step = 0.1,
      }) => {
        const handlePress = (event: any) => {
          const { locationX } = event.nativeEvent;
          const sliderWidth = 200;
          const ratio = Math.max(0, Math.min(1, locationX / sliderWidth));
          const newValue = minimumValue + ratio * (maximumValue - minimumValue);
          const steppedValue = Math.round(newValue / step) * step;
          onValueChange(
            Math.max(minimumValue, Math.min(maximumValue, steppedValue)),
          );
        };

        const thumbPosition =
          ((value - minimumValue) / (maximumValue - minimumValue)) * 200;

        return (
          <View style={styles.sliderContainer}>
            <TouchableOpacity
              style={styles.sliderTrack}
              onPress={handlePress}
              activeOpacity={0.8}
            >
              <View style={[styles.sliderFill, { width: thumbPosition }]} />
              <View style={[styles.sliderThumb, { left: thumbPosition - 8 }]} />
            </TouchableOpacity>
          </View>
        );
      },
    );

    SimpleSlider.displayName = "SimpleSlider";

    return (
      <View style={styles.container}>
        <View style={styles.controls}>
          <Text style={styles.controlLabel}>フィルター全体の適用:</Text>
          <Switch
            value={hasActiveFilters}
            onValueChange={handleToggleAll}
            trackColor={{ false: "#ccc", true: "#007AFF" }}
            thumbColor={hasActiveFilters ? "#fff" : "#f4f3f4"}
          />
        </View>

        <Text style={styles.sectionTitle}>個別フィルター設定</Text>

        <View style={styles.filterToggleContainer}>
          {allConfigs.map((config) => (
            <View key={config.type} style={styles.filterToggleRow}>
              <Text style={styles.filterToggleLabel}>{config.name}</Text>
              <Switch
                value={settings.states[config.type] || false}
                onValueChange={() => onToggleFilter(config.type)}
                trackColor={{ false: "#ccc", true: config.color }}
                thumbColor={settings.states[config.type] ? "#fff" : "#f4f3f4"}
              />
            </View>
          ))}
        </View>

        {/* フィルター順序の設定 */}
        {hasActiveFilters && (
          <>
            <Text style={styles.sectionTitle}>フィルターの適用順序</Text>

            <View style={styles.orderContainer}>
              {settings.order.map((filterType, index) => {
                const isActive = settings.states[filterType];
                const config = filterFactory.getFilterConfig(filterType);

                if (!config) return null;

                return (
                  <View
                    key={filterType}
                    style={[
                      styles.orderItem,
                      !isActive && styles.orderItemInactive,
                    ]}
                  >
                    <View style={styles.orderItemLeft}>
                      <Text style={styles.orderNumber}>{index + 1}</Text>
                      <Text
                        style={[
                          styles.orderItemText,
                          !isActive && styles.orderItemTextInactive,
                        ]}
                      >
                        {config.name}
                      </Text>
                      {!isActive && (
                        <Text style={styles.inactiveLabel}>(無効)</Text>
                      )}
                    </View>

                    <View style={styles.orderControls}>
                      <TouchableOpacity
                        style={[
                          styles.orderButton,
                          index === 0 && styles.orderButtonDisabled,
                        ]}
                        onPress={() => moveFilterUp(index)}
                        disabled={index === 0}
                      >
                        <Text
                          style={[
                            styles.orderButtonText,
                            index === 0 && styles.orderButtonTextDisabled,
                          ]}
                        >
                          ↑
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.orderButton,
                          index === settings.order.length - 1 &&
                            styles.orderButtonDisabled,
                        ]}
                        onPress={() => moveFilterDown(index)}
                        disabled={index === settings.order.length - 1}
                      >
                        <Text
                          style={[
                            styles.orderButtonText,
                            index === settings.order.length - 1 &&
                              styles.orderButtonTextDisabled,
                          ]}
                        >
                          ↓
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        )}

        {/* オーバーレイ画像の選択 */}
        {settings.states.overlay && onSelectOverlayImage && (
          <>
            <Text style={styles.sectionTitle}>オーバーレイ画像</Text>
            <View style={styles.overlayImageSection}>
              <TouchableOpacity
                style={styles.selectImageButton}
                onPress={onSelectOverlayImage}
              >
                <Text style={styles.selectImageButtonText}>
                  {overlayImageUrl
                    ? "オーバーレイ画像を変更"
                    : "オーバーレイ画像を選択"}
                </Text>
              </TouchableOpacity>
              {overlayImageUrl && (
                <Text style={styles.imageSelectedText}>
                  ✓ 画像が選択されています
                </Text>
              )}

              {/* オーバーレイの強度調整 */}
              <View style={styles.overlayIntensitySection}>
                <Text style={styles.intensityLabel}>オーバーレイの強度:</Text>
                <SimpleSlider
                  value={onGetFilterOptions?.("overlay")?.opacity ?? 0.5}
                  onValueChange={(value) => {
                    onSetFilterOptions?.("overlay", { opacity: value });
                  }}
                  minimumValue={0}
                  maximumValue={1}
                  step={0.1}
                />
                <Text style={styles.intensityValue}>
                  {Math.round(
                    (onGetFilterOptions?.("overlay")?.opacity ?? 0.5) * 100,
                  )}
                  %
                </Text>
              </View>
            </View>
          </>
        )}

        <View style={styles.effectsInfo}>
          <Text style={styles.effectsTitle}>適用中の効果:</Text>
          <Text style={styles.effectsText}>
            {!hasActiveFilters
              ? "フィルターが適用されていません"
              : (() => {
                  return (
                    `${activeFilters
                      .map((filterType) => {
                        const config =
                          filterFactory.getFilterConfig(filterType);
                        return config ? `• ${config.description}` : "";
                      })
                      .filter(Boolean)
                      .join("\n")}\n`
                  );
                })()}
          </Text>

          {hasActiveFilters && (
            <Text style={styles.layerOrderInfo}>
              ※ フィルターは「
              {activeFilters
                .map((filterType) => {
                  const config = filterFactory.getFilterConfig(filterType);
                  return config?.name || filterType;
                })
                .join(" → ")}
              」の順で重ねて適用されます
            </Text>
          )}
        </View>
      </View>
    );
  },
);

FilterControls.displayName = "FilterControls";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  controlLabel: {
    fontSize: 16,
    marginRight: 10,
    color: "#333",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#333",
  },
  filterToggleContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 15,
    width: 300,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginBottom: 15,
  },
  filterToggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  filterToggleLabel: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  orderContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 15,
    width: 300,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginBottom: 15,
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  orderItemInactive: {
    opacity: 0.5,
  },
  orderItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  orderNumber: {
    width: 24,
    height: 24,
    backgroundColor: "#007AFF",
    color: "white",
    textAlign: "center",
    lineHeight: 24,
    borderRadius: 12,
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  orderItemText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
    flex: 1,
  },
  orderItemTextInactive: {
    color: "#999",
  },
  inactiveLabel: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
    marginLeft: 8,
  },
  orderControls: {
    flexDirection: "row",
    gap: 5,
  },
  orderButton: {
    width: 32,
    height: 32,
    backgroundColor: "#f0f0f0",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  orderButtonDisabled: {
    backgroundColor: "#f8f8f8",
  },
  orderButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
  },
  orderButtonTextDisabled: {
    color: "#ccc",
  },
  overlayImageSection: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 15,
    width: 300,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginBottom: 15,
    alignItems: "center",
  },
  selectImageButton: {
    backgroundColor: "#FF9500",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  selectImageButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  imageSelectedText: {
    fontSize: 14,
    color: "#34C759",
    fontWeight: "500",
  },
  effectsInfo: {
    marginTop: 15,
    padding: 12,
    backgroundColor: "white",
    borderRadius: 8,
    width: 300,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  effectsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#333",
  },
  effectsText: {
    fontSize: 12,
    color: "#666",
    lineHeight: 18,
  },
  layerOrderInfo: {
    fontSize: 11,
    color: "#888",
    fontStyle: "italic",
    marginTop: 8,
    lineHeight: 16,
  },
  sliderContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  sliderTrack: {
    width: 200,
    height: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    justifyContent: "center",
    position: "relative",
  },
  sliderFill: {
    height: 20,
    backgroundColor: "#FF9500",
    borderRadius: 10,
    position: "absolute",
    left: 0,
  },
  sliderThumb: {
    width: 16,
    height: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    position: "absolute",
    borderWidth: 2,
    borderColor: "#FF9500",
    top: 2,
  },
  overlayIntensitySection: {
    marginTop: 15,
    alignItems: "center",
    width: "100%",
  },
  intensityLabel: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    marginBottom: 8,
  },
  intensityValue: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
    fontWeight: "600",
  },
});

export default FilterControls;
