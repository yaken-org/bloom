import { type CameraType, CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import { LinearGradient } from "expo-linear-gradient";
import * as MediaLibrary from "expo-media-library";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function NeonCamera() {
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>("back");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [isReady, setIsReady] = useState(false);
  const [strobeActive, setStrobeActive] = useState(false);

  // アニメーション値
  const [pulseAnim] = useState(() => new Animated.Value(1));
  const [strobeOpacity] = useState(() => new Animated.Value(0));
  const [glowAnim] = useState(() => new Animated.Value(0));
  
  // フレーム回転用のアニメーション値
  const [outerRotation] = useState(() => new Animated.Value(0));
  const [innerRotation] = useState(() => new Animated.Value(0));

  // 浮遊星エフェクト用
  const sparkleAnimValues = useMemo(
    () => Array.from({ length: 12 }, () => new Animated.Value(0)),
    [],
  );
  const floatAnimValues = useMemo(
    () => Array.from({ length: 12 }, () => new Animated.Value(0)),
    [],
  );

  const { squareSize, squareTop, squareLeft } = useMemo(() => {
    const screenWidth = Dimensions.get("window").width;
    const screenHeight = Dimensions.get("window").height;
    const squareSize = Math.min(screenWidth, screenHeight) * 0.85;
    const squareTop = (screenHeight - squareSize) / 2;
    const squareLeft = (screenWidth - squareSize) / 2;
    return { squareSize, squareTop, squareLeft };
  }, []);

  // 星の位置設定
  const starConfigs = [
    { style: { top: 80, left: 20 }, size: 20 },
    { style: { top: 80, right: 20 }, size: 18 },
    { style: { top: 120, left: 40 }, size: 16 },
    { style: { top: 120, right: 40 }, size: 22 },
    { style: { bottom: 80, left: 20 }, size: 24 },
    { style: { bottom: 80, right: 20 }, size: 18 },
    { style: { bottom: 120, left: 40 }, size: 20 },
    { style: { bottom: 120, right: 40 }, size: 26 },
    { style: { bottom: 160, left: 60 }, size: 16 },
    { style: { bottom: 160, right: 60 }, size: 22 },
    { style: { bottom: 200, left: 80 }, size: 18 },
    { style: { bottom: 200, right: 80 }, size: 20 },
  ];

  // カメラのパーミッションと初期化を管理
  useEffect(() => {
    const initializeCamera = async () => {
      try {
        if (!permission) {
          return;
        }

        if (!permission.granted) {
          const result = await requestPermission();
          if (!result.granted) {
            Alert.alert(
              "カメラのアクセス許可が必要です",
              "アプリの設定からカメラへのアクセスを許可してください。",
            );
            return;
          }
        }

        setTimeout(() => {
          setIsReady(true);
        }, 100);
      } catch (error) {
        console.error("Camera initialization error:", error);
        Alert.alert("エラー", "カメラの初期化に失敗しました。");
      }
    };

    initializeCamera();
  }, [permission, requestPermission]);

  // アニメーション初期化
  useEffect(() => {
    // 撮影ボタンのパルス
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // 背景のグローアニメーション
    Animated.loop(
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
    ).start();

    // フレーム回転アニメーション
    // 外の円は右回りに4秒
    Animated.loop(
      Animated.timing(outerRotation, {
        toValue: 1,
        duration: 9000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    // 内の円は左回りに5秒
    Animated.loop(
      Animated.timing(innerRotation, {
        toValue: 1,
        duration: 10000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    // 星の浮遊アニメーション
    const createStarAnimations = () => {
      const starScaleSequences = sparkleAnimValues.map((animValue, index) =>
        Animated.sequence([
          Animated.delay(index * 200),
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

      const floatSequences = floatAnimValues.map((animValue, index) =>
        Animated.sequence([
          Animated.delay(index * 150),
          Animated.loop(
            Animated.sequence([
              Animated.timing(animValue, {
                toValue: 1,
                duration: 2000 + index * 100,
                useNativeDriver: true,
              }),
              Animated.timing(animValue, {
                toValue: 0,
                duration: 2000 + index * 100,
                useNativeDriver: true,
              }),
            ]),
          ),
        ]),
      );

      return Animated.parallel([...starScaleSequences, ...floatSequences]);
    };

    const starAnimation = createStarAnimations();
    starAnimation.start();

    return () => {
      starAnimation.stop();
    };
  }, [pulseAnim, glowAnim, outerRotation, innerRotation, sparkleAnimValues, floatAnimValues]);

  // ストロボエフェクト
  useEffect(() => {
    if (strobeActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(strobeOpacity, {
            toValue: 0.9,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(strobeOpacity, {
            toValue: 0,
            duration: 50,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      strobeOpacity.setValue(0);
    }
  }, [strobeActive, strobeOpacity]);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1,
          base64: false,
          exif: false,
        });

        const { width, height } = photo;
        const cropSize = Math.min(width, height);
        const cropped = await ImageManipulator.manipulateAsync(
          photo.uri,
          [
            {
              crop: {
                originX: (width - cropSize) / 2,
                originY: (height - cropSize) / 2,
                width: cropSize,
                height: cropSize,
              },
            },
          ],
          { compress: 1, format: ImageManipulator.SaveFormat.PNG },
        );

        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status === "granted") {
          await MediaLibrary.saveToLibraryAsync(cropped.uri);
        }

        // ローディング画面経由でTestPageに遷移
        router.push({
          pathname: "/loading",
          params: { imageUri: cropped.uri },
        });
      } catch (error) {
        console.error("Failed to take picture:", error);
        Alert.alert(
          "エラー",
          "写真の撮影に失敗しました。もう一度お試しください。",
        );
      }
    }
  };

  if (photoUri) {
    return (
      <View style={styles.container}>
        {/* 背景グラデーション */}
        <LinearGradient
          colors={["#1a0033", "#330066", "#660099", "#330066", "#1a0033"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />

        <View style={styles.previewContainer}>
          <View style={styles.previewImage} />
          <TouchableOpacity
            style={styles.neonButton}
            onPress={() => setPhotoUri(null)}
          >
            <View style={styles.neonButtonInner}>
              <Text style={styles.neonButtonText}>RETAKE</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!permission) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={["#1a0033", "#330066", "#660099"]}
          style={StyleSheet.absoluteFillObject}
        />
        <ActivityIndicator size="large" color="#00ffff" />
        <Text style={styles.loadingText}>カメラを準備中...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <LinearGradient
          colors={["#1a0033", "#330066", "#660099"]}
          style={StyleSheet.absoluteFillObject}
        />
        <Text style={styles.permissionText}>
          カメラへのアクセス許可が必要です
        </Text>
        <TouchableOpacity
          style={styles.neonButton}
          onPress={requestPermission}
        >
          <View style={styles.neonButtonInner}>
            <Text style={styles.neonButtonText}>許可する</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={["#1a0033", "#330066", "#660099"]}
          style={StyleSheet.absoluteFillObject}
        />
        <ActivityIndicator size="large" color="#00ffff" />
        <Text style={styles.loadingText}>カメラを起動中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 背景グラデーション */}
      <LinearGradient
        colors={["#1a0033", "#330066", "#660099", "#330066", "#1a0033"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* アニメーション付きキラキラ背景エフェクト */}
      <Animated.View
        style={[
          styles.glowBackground,
          {
            opacity: glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.1, 0.25],
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

      {/* アニメーション付き紫ネオン星エフェクト */}
      {starConfigs.map((config, index) => (
        <Animated.View
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

      {/* カメラビュー */}
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        onMountError={(error) => {
          console.error("Camera mount error:", error);
          Alert.alert(
            "カメラエラー",
            "カメラの起動に失敗しました。アプリを再起動してください。",
          );
        }}
      />

      {/* カメラオーバーレイ */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
        {/* 上 */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: squareTop,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
          }}
        />
        {/* 下 */}
        <View
          style={{
            position: "absolute",
            top: squareTop + squareSize,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
          }}
        />
        {/* 左 */}
        <View
          style={{
            position: "absolute",
            top: squareTop,
            left: 0,
            width: squareLeft,
            height: squareSize,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
          }}
        />
        {/* 右 */}
        <View
          style={{
            position: "absolute",
            top: squareTop,
            left: squareLeft + squareSize,
            width: squareLeft,
            height: squareSize,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
          }}
        />

        {/* ネオンフレーム */}
        <View
          style={[
            styles.neonFrame,
            {
              top: squareTop,
              left: squareLeft,
              width: squareSize,
              height: squareSize,
            },
          ]}
        >
          {/* 外の円（右回り4秒） */}
          <Animated.View
            style={[
              styles.outerCircle,
              {
                width: squareSize - 20,
                height: squareSize - 20,
                borderRadius: (squareSize - 20) / 2,
                transform: [
                  {
                    rotate: outerRotation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                ],
              },
            ]}
          />
          
          {/* 内の円（左回り5秒） */}
          <Animated.View
            style={[
              styles.innerCircle,
              {
                width: squareSize - 40,
                height: squareSize - 40,
                borderRadius: (squareSize - 40) / 2,
                transform: [
                  {
                    rotate: innerRotation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '-360deg'], // 左回り
                    }),
                  },
                ],
              },
            ]}
          />
        </View>
      </View>

      {/* コントロールボタン */}
      <View style={styles.buttonContainer}>
        <View style={styles.sideButtons}>
          <TouchableOpacity
            style={styles.neonButton}
            onPress={() => setFacing((f) => (f === "back" ? "front" : "back"))}
          >
            <View style={styles.neonButtonInner}>
              <Text style={styles.flipButtonText}>🔄</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.hiddenDebugStar}
            onPress={() => router.push("/debug")}
          >
            <View style={styles.debugStarShape} />
          </TouchableOpacity>
        </View>

        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <LinearGradient
              colors={["#ff00ff", "#00ffff", "#ffff00"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.captureButtonGradient}
            >
              <View style={styles.captureButtonInner} />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity
          style={styles.neonButton}
          onPress={() => setStrobeActive(!strobeActive)}
        >
          <View style={styles.neonButtonInner}>
            <Text style={styles.effectButtonText}>⚡</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* ストロボエフェクト */}
      <Animated.View
        style={[
          styles.strobeEffect,
          {
            opacity: strobeOpacity,
          },
        ]}
        pointerEvents="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#00ffff",
    fontSize: 16,
    marginTop: 10,
    fontWeight: "600",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  permissionText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "600",
  },
  neonFrame: {
    position: "absolute",
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerCircle: {
    position: 'absolute',
    borderWidth: 3,
    borderColor: '#ff00ff',
    borderStyle: 'dashed',
    backgroundColor: 'transparent',
    shadowColor: "#ff00ff",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  innerCircle: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#00ffff',
    borderStyle: 'dashed',
    backgroundColor: 'transparent',
    shadowColor: "#00ffff",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 50,
  },
  sideButtons: {
    flexDirection: "column",
    gap: 10,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: "hidden",
  },
  captureButtonGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  captureButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  flipButtonText: {
    fontSize: 20,
    color: "#fff",
  },
  effectButtonText: {
    fontSize: 20,
    color: "#fff",
  },
  strobeEffect: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "white",
  },
  previewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: {
    width: 350,
    height: 350,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#00ffff",
    backgroundColor: "#333",
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
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  neonButtonInner: {
    backgroundColor: "#000",
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    width: 46,
    height: 46,
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
  // 紫ネオン星エフェクト
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
  // 隠されたデバッグ星
  hiddenDebugStar: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  debugStarShape: {
    width: 20,
    height: 20,
    backgroundColor: "#ff00ff",
    transform: [{ rotate: "45deg" }],
    shadowColor: "#ff00ff",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  // キラキラ背景エフェクト
  glowBackground: {
    position: "absolute",
    top: -100,
    left: -100,
    width: 500,
    height: 500,
    borderRadius: 250,
    opacity: 0.15,
    zIndex: -10,
  },
  rainbowGradient: {
    flex: 1,
    borderRadius: 250,
  },
});
