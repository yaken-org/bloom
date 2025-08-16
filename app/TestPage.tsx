import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import FilterControls from "@/components/FilterControls";
import FilterView, { type FilterViewRef } from "@/components/FilterView";
import { useFilters } from "@/hooks/useFilters";

/**
 * TestPage - フィルターシステムの実装
 *
 * 主な機能:
 * 1. 画像選択
 * 2. フィルターの適用
 * 3. フィルター順序の変更
 * 4. 画像保存
 */
const TestPage: React.FC = () => {
  const [overlayImageUrl, setOverlayImageUrl] = useState<string | null>(null);

  const {
    imageUri,
    width: widthStr, 
    height: heightStr,
  } = useLocalSearchParams<{
    imageUri: string;
    width: string;
    height: string;
  }>();

  const width = parseInt(widthStr, 10);
  const height = parseInt(heightStr, 10);

  const {
    settings,
    activeFilters,
    hasActiveFilters,
    toggleFilter,
    reorderFilters,
    setFilterOptions,
    getFilterOptions,
  } = useFilters();

  // FilterViewの参照
  const filterViewRef = useRef<FilterViewRef>(null);

  /**
   * オーバーレイ画像選択ハンドラー
   */
  const handleSelectOverlayImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "パーミッション必要",
          "カメラロールにアクセスするには写真へのアクセス許可が必要です。",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setOverlayImageUrl(result.assets[0].uri);
        // オーバーレイ画像URLをフィルターオプションに設定
        setFilterOptions("overlay", { overlayImageUrl: result.assets[0].uri });
      }
    } catch (error) {
      Alert.alert("エラー", "オーバーレイ画像の選択に失敗しました。");
      console.error("Overlay image picker error:", error);
    }
  };

  /**
   * 画像保存ハンドラー
   */
  const handleSaveImage = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "パーミッション必要",
          "画像を保存するにはメディアライブラリへのアクセス許可が必要です。",
        );
        return;
      }

      const snapshot = filterViewRef.current?.makeImageSnapshot();
      if (!snapshot) {
        Alert.alert("エラー", "画像のスナップショットを取得できませんでした。");
        return;
      }

      const base64Data = snapshot.encodeToBase64();
      if (!base64Data) {
        Alert.alert("エラー", "画像のエンコードに失敗しました。");
        return;
      }

      const filename = `filtered_image_${Date.now()}.png`;
      const fileUri = `${FileSystem.documentDirectory}${filename}`;

      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.createAlbumAsync("Bloom", asset, false);

      Alert.alert(
        "保存完了",
        "フィルター適用済みの画像を写真アルバムに保存しました。",
        [{ text: "OK" }],
      );
    } catch (error) {
      console.error("Save image error:", error);
      Alert.alert("エラー", "画像の保存に失敗しました。");
    }
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        bounces={true}
        contentInsetAdjustmentBehavior="automatic"
      >
        <StatusBar style="auto" />

        <Text style={styles.title}>フィルターシステム</Text>
        <Text style={styles.subtitle}>
          フィルター管理とパフォーマンス最適化
        </Text>

        {imageUri ? (
          <>
            <FilterView
              ref={filterViewRef}
              imageUrl={imageUri}
              filters={activeFilters}
              overlayImageUrl={overlayImageUrl || undefined}
              filterOptions={settings.options}
            />

            <FilterControls
              settings={settings}
              activeFilters={activeFilters}
              hasActiveFilters={hasActiveFilters}
              overlayImageUrl={overlayImageUrl}
              onToggleFilter={toggleFilter}
              onReorderFilter={reorderFilters}
              onSelectOverlayImage={handleSelectOverlayImage}
              onSetFilterOptions={setFilterOptions}
              onGetFilterOptions={getFilterOptions}
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveImage}
            >
              <Text style={styles.saveButtonText}>画像を保存</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>
              画像が渡されませんでした
            </Text>
          </View>
        )}

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    flex: 1,
  },
  container: {
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  selectButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  selectButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  saveButton: {
    backgroundColor: "#28a745",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  placeholderContainer: {
    width: 300,
    height: 225,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  placeholderText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default TestPage;
