import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import FilterView, { type FilterViewRef } from "@/components/FilterView";
import { useFilters } from "@/hooks/useFilters";
import getRandomFilters from "@/lib/filters/genRandomFilters";
import type { FilterType } from "@/types/filters";

const ViewPage: React.FC = () => {
  const router = useRouter();
  const [overlayImageUrl] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const { imageUri } = useLocalSearchParams<{
    imageUri: string;
  }>();

  const { settings, activeFilters, toggleFilter, setFilterOptions } = useFilters();

  // FilterViewの参照
  const filterViewRef = useRef<FilterViewRef>(null);

  // ランダムフィルターを初期化時に適用
  React.useEffect(() => {
    if (!isInitialized) {
      const [randomFilters, overlayOptions] = getRandomFilters();
      
      console.log("ViewPage - randomFilters:", randomFilters);
      console.log("ViewPage - overlayOptions:", overlayOptions);
      
      // OverlayFilterのオプションを設定
      if (Object.keys(overlayOptions).length > 0) {
        console.log("ViewPage - setting overlay options:", overlayOptions);
        setFilterOptions("overlay", overlayOptions);
      }
      
      // ランダムに選択されたフィルターを有効化
      Object.keys(settings.states).forEach((filterType) => {
        const shouldEnable = randomFilters.includes(filterType);
        if (settings.states[filterType as FilterType] !== shouldEnable) {
          toggleFilter(filterType as FilterType);
        }
      });
      
      setIsInitialized(true);
    }
  }, [isInitialized, settings.states, toggleFilter, setFilterOptions]);

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

  const handleShareImage = async () => {
    let fileUri: string | null = null;

    try {
      // デバイスが共有機能をサポートしているかチェック
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert(
          "エラー",
          "このデバイスでは共有機能がサポートされていません。",
        );
        return;
      }

      // 画像のスナップショットを取得
      const snapshot = filterViewRef.current?.makeImageSnapshot();
      if (!snapshot) {
        Alert.alert("エラー", "画像のスナップショットを取得できませんでした。");
        return;
      }

      // Base64データにエンコード
      const base64Data = snapshot.encodeToBase64();
      if (!base64Data) {
        Alert.alert("エラー", "画像のエンコードに失敗しました。");
        return;
      }

      // 一時ファイルを作成
      const filename = `bloom_image_${Date.now()}.png`;
      fileUri = `${FileSystem.documentDirectory}${filename}`;

      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // expo-sharingを使用して共有
      await Sharing.shareAsync(fileUri, {
        mimeType: "image/png",
        dialogTitle: "Bloom - フィルター適用済み画像を共有",
        UTI: "public.png",
      });

      console.log("画像が共有されました");
    } catch (error) {
      console.error("Share image error:", error);
      Alert.alert("エラー", "画像の共有に失敗しました。");
    } finally {
      // 共有の成功/失敗に関わらず一時ファイルを削除
      if (fileUri) {
        try {
          await FileSystem.deleteAsync(fileUri, { idempotent: true });
          console.log("一時ファイルを削除しました:", fileUri);
        } catch (deleteError) {
          console.warn("一時ファイルの削除に失敗しました:", deleteError);
        }
      }
    }
  };

  const handleGoBack = () => {
    router.replace("/");
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

        {/* 戻るボタン */}
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backButtonText}>← カメラに戻る</Text>
        </TouchableOpacity>

        {imageUri ? (
          <>
            <FilterView
              ref={filterViewRef}
              imageUrl={imageUri}
              filters={activeFilters}
              overlayImageUrl={overlayImageUrl || undefined}
              filterOptions={settings.options}
            />
            {/* デバッグ情報を表示 */}
            {console.log("ViewPage - render time settings.options:", settings.options)}
            {console.log("ViewPage - render time activeFilters:", activeFilters)}

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveImage}
            >
              <Text style={styles.saveButtonText}>画像を保存</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.shareButton}
              onPress={handleShareImage}
            >
              <Text style={styles.shareButtonText}>共有</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>画像が渡されませんでした</Text>
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
  backButton: {
    position: "absolute",
    top: 30,
    left: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 10,
  },
  backButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
    textAlign: "center",
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
    marginTop: 70,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  shareButton: {
    backgroundColor: "#28a745",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  shareButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  randomButton: {
    backgroundColor: "#6c757d",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  randomButtonText: {
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

export default ViewPage;
