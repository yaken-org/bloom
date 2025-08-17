import * as FileSystem from "expo-file-system";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import * as MediaLibrary from "expo-media-library";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
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
  const screenWidth = Dimensions.get("window").width;
  const _screenHeight = Dimensions.get("window").height;

  // キラキラアニメーション用（共通化）
  const sparkleAnimValues = useMemo(
    () => Array.from({ length: 18 }, () => new Animated.Value(0)),
    [],
  );
  const [glowAnim] = useState(() => new Animated.Value(0));

  // 星の位置設定（写真エリアを完全に避けて配置）
  const starConfigs = [
    // 上段（戻るボタンエリア周辺）
    { style: { top: 70, left: 15 }, size: 20 }, // 上部左（戻るボタンの下）
    { style: { top: 70, right: 15 }, size: 20 }, // 上部右
    { style: { top: 100, left: screenWidth * 0.12 }, size: 18 }, // 上部左寄り
    { style: { top: 100, right: screenWidth * 0.12 }, size: 18 }, // 上部右寄り
    { style: { top: 130, left: screenWidth * 0.05 }, size: 16 }, // 上部左端
    { style: { top: 130, right: screenWidth * 0.05 }, size: 16 }, // 上部右端

    // 下段（ボタンエリア周辺）- 大幅に増やしてばらつかせる
    { style: { bottom: 40, left: 10 }, size: 28 }, // 大きめ
    { style: { bottom: 45, right: 15 }, size: 24 }, // 中くらい
    { style: { bottom: 70, left: screenWidth * 0.06 }, size: 32 }, // 特大
    { style: { bottom: 65, right: screenWidth * 0.08 }, size: 20 }, // 普通
    { style: { bottom: 90, left: screenWidth * 0.12 }, size: 26 }, // 大きめ
    { style: { bottom: 85, right: screenWidth * 0.15 }, size: 18 }, // 小さめ
    { style: { bottom: 110, left: screenWidth * 0.18 }, size: 22 }, // 中くらい
    { style: { bottom: 105, right: screenWidth * 0.2 }, size: 30 }, // 大きめ
    { style: { bottom: 130, left: screenWidth * 0.25 }, size: 16 }, // 小さめ
    { style: { bottom: 125, right: screenWidth * 0.22 }, size: 24 }, // 中くらい
    { style: { bottom: 55, left: screenWidth * 0.35 }, size: 20 }, // 中央寄り
    { style: { bottom: 80, right: screenWidth * 0.32 }, size: 34 }, // 超特大
  ];
  const [hasPublished, setHasPublished] = useState(false);

  // ふわふわ浮かぶアニメーション用
  const floatAnimValues = useMemo(
    () => Array.from({ length: 18 }, () => new Animated.Value(0)),
    [],
  );

  const { imageUri } = useLocalSearchParams<{
    imageUri: string;
  }>();

  // 星のアニメーション効果
  useEffect(() => {
    // すべての星を一つのアニメーションシーケンスで管理
    const createUnifiedStarAnimation = () => {
      const starScaleSequences = sparkleAnimValues.map((animValue, index) =>
        Animated.sequence([
          Animated.delay(index * 300), // 段階的な開始遅延
          Animated.loop(
            Animated.sequence([
              Animated.timing(animValue, {
                toValue: 1,
                duration: 1500,
                useNativeDriver: true,
              }),
              Animated.timing(animValue, {
                toValue: 0.3,
                duration: 1500,
                useNativeDriver: true,
              }),
            ]),
          ),
        ]),
      );

      // ふわふわ浮かぶアニメーション
      const floatSequences = floatAnimValues.map((animValue, index) =>
        Animated.sequence([
          Animated.delay(index * 200),
          Animated.loop(
            Animated.sequence([
              Animated.timing(animValue, {
                toValue: 1,
                duration: 2000 + index * 200, // 各星で微妙に異なる周期
                useNativeDriver: true,
              }),
              Animated.timing(animValue, {
                toValue: 0,
                duration: 2000 + index * 200,
                useNativeDriver: true,
              }),
            ]),
          ),
        ]),
      );

      // すべてのアニメーションを並列実行
      return Animated.parallel([...starScaleSequences, ...floatSequences]);
    };

    // 統一された星アニメーション
    const unifiedStarAnimation = createUnifiedStarAnimation();
    unifiedStarAnimation.start();

    // 背景のグローアニメーション
    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: false,
        }),
      ]),
    );
    glowAnimation.start();

    return () => {
      // 統一されたアニメーションを停止
      unifiedStarAnimation.stop();
      glowAnimation.stop();
    };
  }, [sparkleAnimValues, floatAnimValues, glowAnim]);

  const { settings, activeFilters, toggleFilter, setFilterOptions } =
    useFilters();

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
  }, [isInitialized, setFilterOptions, settings.states, toggleFilter]);

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

  const handlePublishToHub = async () => {
    // すでに投稿済みの場合は何もしない
    if (hasPublished) {
      Alert.alert(
        "すでに投稿済み",
        "この画像はすでに投稿されています。新しい写真を撮影してから投稿してください。",
      );
      return;
    }

    try {
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

      // 一時ファイルに保存
      const filename = `bloom_${Date.now()}.png`;
      const fileUri = `${FileSystem.documentDirectory}${filename}`;

      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // FormDataを作成（React Native用の形式）
      const formData = new FormData();
      formData.append("image", {
        uri: fileUri,
        type: "image/png",
        name: filename,
        // biome-ignore lint/suspicious/noExplicitAny: React Native だと型が異なる？
      } as any);

      // GILANTIC PHOTO's Hubに投稿
      const response = await fetch("https://gilantic.km3.dev/api/v1/posts", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // 一時ファイルを削除
      await FileSystem.deleteAsync(fileUri, { idempotent: true });

      // 投稿済みフラグを設定
      setHasPublished(true);

      Alert.alert("公開完了", "画像をGILANTIC PHOTO's Hubに公開しました！", [
        {
          text: "投稿を見る",
          onPress: async () => {
            const url = `https://gilantic.km3.dev/post/${result.id}`;
            await Linking.openURL(url);
          },
        },
        {
          text: "閉じる",
          style: "cancel",
        },
      ]);
    } catch (error) {
      console.error("Publish to hub error:", error);
      Alert.alert("エラー", "GILANTIC PHOTO's Hubへの公開に失敗しました。");
    }
  };

  const handleGoBack = () => {
    router.replace("/");
  };

  return (
    <View style={styles.mainContainer}>
      {/* アニメーション付きギラギラ背景エフェクト */}
      <Animated.View
        style={[
          styles.glowBackground,
          {
            width: screenWidth * 1.5,
            height: screenWidth * 1.5,
            opacity: glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.1, 0.25], // より控えめな範囲
            }),
          },
        ]}
      >
        <LinearGradient
          colors={["#FF6B9D", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"]}
          style={styles.rainbowGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      {/* アニメーション付き紫ネオン星エフェクト - 写真エリアを避けて配置 */}
      {starConfigs.map((config, index) => (
        <Animated.View
          //biome-ignore lint/suspicious/noArrayindex: <unknown id>
          key={`star-${index}`}
          style={[
            styles.neonStar,
            config.style,
            {
              width: config.size || 20,
              height: config.size || 20,
              opacity: sparkleAnimValues[index].interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 1],
              }),
              transform: [
                {
                  scale: sparkleAnimValues[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.4, 1.3],
                  }),
                },
                {
                  translateY: floatAnimValues[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -15],
                  }),
                },
              ],
            },
          ]}
        >
          <View
            style={[
              styles.starShape,
              {
                width: config.size || 20,
                height: config.size || 20,
              },
            ]}
          />
        </Animated.View>
      ))}

      {/* 戻るボタン - 紫ネオンスタイル */}
      <View style={styles.backButtonContainer}>
        <TouchableOpacity style={styles.neonButton} onPress={handleGoBack}>
          <View style={styles.neonButtonInner}>
            <Text style={styles.neonButtonText}>← BACK</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        <StatusBar style="light" />

        {imageUri ? (
          <>
            {/* 写真表示エリア - 中央に配置 */}
            <View style={styles.imageContainer}>
              <FilterView
                ref={filterViewRef}
                imageUrl={imageUri}
                filters={activeFilters}
                overlayImageUrl={overlayImageUrl || undefined}
                filterOptions={settings.options}
              />
            </View>

            {/* ボタンエリア - 写真の下に明確に分離 */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.neonButton}
                onPress={handleSaveImage}
              >
                <View style={styles.neonButtonInner}>
                  <Text style={styles.neonButtonText}>SAVE</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.neonButton, styles.shareButton]}
                onPress={handleShareImage}
              >
                <View style={styles.neonButtonInner}>
                  <Text style={styles.neonButtonText}>SHARE</Text>
                </View>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.publishButton,
                hasPublished && styles.publishButtonDisabled,
              ]}
              onPress={handlePublishToHub}
              disabled={hasPublished}
            >
              <Text style={styles.publishButtonText}>
                {hasPublished
                  ? "投稿済み - 新しい写真を撮影してください"
                  : "GILANTIC PHOTO's Hubに公開"}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>画像が渡されませんでした</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#000", // カメラと同じ黒色に変更
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
    paddingTop: 120, // 戻るボタンとの重なりを避ける
  },
  // 戻るボタンの位置を固定
  backButtonContainer: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 100,
  },
  // 写真表示エリア
  imageContainer: {
    marginBottom: 50, // 写真とボタンの間により大きなスペース
    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  // ボタンエリア - 写真の下に配置
  buttonContainer: {
    alignItems: "center",
    gap: 20, // ボタン間のスペースを広げる
    paddingTop: 10, // 上部にパディング追加
  },
  // 紫ネオン星のスタイル
  neonStar: {
    position: "absolute",
    zIndex: 5,
  },
  starShape: {
    backgroundColor: "#ff00ff",
    transform: [{ rotate: "45deg" }],
    shadowColor: "#ff00ff",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 12,
  },
  // 紫ネオンボタンスタイル
  neonButton: {
    backgroundColor: "#000",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#ff00ff",
    padding: 2,
    shadowColor: "#ff00ff",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },
  neonButtonInner: {
    backgroundColor: "#000",
    borderRadius: 28,
    paddingHorizontal: 25,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  neonButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 2,
    textShadowColor: "#ff00ff",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  shareButton: {
    marginTop: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#fff", // 白色に変更
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
    backgroundColor: "rgba(255, 255, 255, 0.1)", // 白の半透明に変更
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  placeholderText: {
    fontSize: 16,
    color: "#ccc", // 明るいグレーに変更
    textAlign: "center",
  },
  // 静的なギラギラ効果用スタイル
  glowBackground: {
    position: "absolute",
    top: -100,
    left: -100,
    borderRadius: 1000,
    opacity: 0.15,
    zIndex: -10,
  },
  rainbowGradient: {
    flex: 1,
    borderRadius: 1000,
  },
  sparkle: {
    position: "absolute",
    fontSize: 20,
    zIndex: 5,
    textShadowColor: "#fff",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
});

export default ViewPage;
