import * as FileSystem from "expo-file-system";
import { LinearGradient } from "expo-linear-gradient";
import * as MediaLibrary from "expo-media-library";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
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
  const screenWidth = Dimensions.get("window").width;

  // キラキラアニメーション用（共通化）
  const sparkleAnimValues = useMemo(
    () => [
      new Animated.Value(0),
      new Animated.Value(0),
      new Animated.Value(0),
      new Animated.Value(0),
      new Animated.Value(0),
      new Animated.Value(0),
      new Animated.Value(0),
      new Animated.Value(0),
    ],
    [],
  );
  const [glowAnim] = useState(() => new Animated.Value(0));

  // キラキラの位置と絵文字の設定
  const sparkleConfigs = [
    { emoji: "✨", style: { top: 80, left: 20 } },
    { emoji: "⭐", style: { top: 120, right: 20 } },
    { emoji: "💫", style: { bottom: 150, left: 30 } },
    { emoji: "🌟", style: { bottom: 200, right: 40 } },
    { emoji: "✨", style: { bottom: 100, left: 50 } },
    { emoji: "🌟", style: { top: 180, left: screenWidth * 0.6 } },
    { emoji: "💫", style: { top: 250, left: 80 } },
    { emoji: "⭐", style: { bottom: 300, right: 60 } },
  ];

  const { imageUri } = useLocalSearchParams<{
    imageUri: string;
  }>();

  // キラキラアニメーション効果
  useEffect(() => {
    // すべてのキラキラを一つのアニメーションシーケンスで管理
    const createUnifiedSparkleAnimation = () => {
      const sparkleSequences = sparkleAnimValues.map((animValue, index) =>
        Animated.sequence([
          Animated.delay(index * 200), // 段階的な開始遅延
          Animated.loop(
            Animated.sequence([
              Animated.timing(animValue, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
              }),
              Animated.timing(animValue, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
              }),
              Animated.delay(500),
            ]),
          ),
        ]),
      );

      // すべてのキラキラアニメーションを並列実行（但し一つのアニメーションとして管理）
      return Animated.parallel(sparkleSequences);
    };

    // 統一されたキラキラアニメーション
    const unifiedSparkleAnimation = createUnifiedSparkleAnimation();
    unifiedSparkleAnimation.start();

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
      unifiedSparkleAnimation.stop();
      glowAnimation.stop();
    };
  }, [sparkleAnimValues, glowAnim]);

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

      {/* アニメーション付きキラキラ効果（共通化） */}
      {sparkleConfigs.map((config, index) => (
        <Animated.Text
          key={`sparkle-${config.emoji}-${index}`}
          style={[
            styles.sparkle,
            config.style,
            {
              opacity: sparkleAnimValues[index],
              transform: [{ scale: sparkleAnimValues[index] }],
            },
          ]}
        >
          {config.emoji}
        </Animated.Text>
      ))}

      {/* 戻るボタン - 絶対位置で画像と重ならない位置に */}
      <View
        style={{
          position: "absolute",
          top: 50,
          left: 20,
          zIndex: 100,
        }}
      >
        <TouchableOpacity
          style={[styles.backButton, styles.glowButton]}
          onPress={handleGoBack}
        >
          <LinearGradient
            colors={["#667eea", "#764ba2"]}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.backButtonText}>✨ ← カメラに戻る ✨</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        bounces={true}
        contentInsetAdjustmentBehavior="automatic"
        contentInset={{ top: 0 }} // iOS用の追加マージン
      >
        <StatusBar style="light" />

        {imageUri ? (
          <>
            <FilterView
              ref={filterViewRef}
              imageUrl={imageUri}
              filters={activeFilters}
              overlayImageUrl={overlayImageUrl || undefined}
              filterOptions={settings.options}
            />

            {/* ギラギラタイトル - 写真の下に配置 */}
            <View
              style={{
                marginTop: 50, // 写真との間隔をさらに増やす
                marginBottom: 30,
              }}
            >
              <LinearGradient
                colors={["#FF6B9D", "#4ECDC4", "#45B7D1"]}
                style={styles.titleGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.glowTitle}>✨ BLOOM CAMERA ✨</Text>
              </LinearGradient>
            </View>

            {/* ボタンを縦並びに配置 */}
            <View
              style={{
                marginTop: 30,
                width: "100%",
                paddingHorizontal: 20,
              }}
            >
              <TouchableOpacity
                style={[styles.saveButton, styles.glowButton]}
                onPress={handleSaveImage}
              >
                <LinearGradient
                  colors={["#FF6B9D", "#C44569"]}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.saveButtonText}>✨ 画像を保存 ✨</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <View
              style={{
                marginTop: 15,
                width: "100%",
                paddingHorizontal: 20,
              }}
            >
              <TouchableOpacity
                style={[styles.shareButton, styles.glowButton]}
                onPress={handleShareImage}
              >
                <LinearGradient
                  colors={["#4ECDC4", "#44A08D"]}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.shareButtonText}>🌟 共有 🌟</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
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
    backgroundColor: "#000", // カメラと同じ黒色に変更
  },
  scrollContainer: {
    flex: 1,
  },
  container: {
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
    paddingTop: 120, // 戻るボタンとの重なりを避けるためさらに増やす
    paddingBottom: 40,
  },
  backButton: {
    borderRadius: 20,
    overflow: "hidden", // グラデーション用
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
  saveButton: {
    borderRadius: 8,
    overflow: "hidden", // グラデーション用
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  shareButton: {
    borderRadius: 8,
    overflow: "hidden", // グラデーション用
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
  glowButton: {
    shadowColor: "#FF6B9D",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.6, // 少し抑えめに
    shadowRadius: 8, // 少し小さく
    elevation: 8, // Android用
    zIndex: 50, // 適切なレイヤー
  },
  buttonGradient: {
    paddingHorizontal: 20, // 元のサイズに戻す
    paddingVertical: 12, // 元のサイズに戻す
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  titleGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  glowTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "#fff",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    letterSpacing: 2,
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
