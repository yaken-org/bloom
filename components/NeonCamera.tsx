import { type CameraType, CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import { LinearGradient } from "expo-linear-gradient";
import * as MediaLibrary from "expo-media-library";
import { useRouter } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Easing,
  Image,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle } from "react-native-svg";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

let particleIdCounter = 0;

export default function NeonCamera() {
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>("back");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [isReady, setIsReady] = useState(false);
  const [strobeActive, setStrobeActive] = useState(false);

  interface Particle {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    opacity: number;
  }

  const [particles, setParticles] = useState<Particle[]>([]);
  const [touches, setTouches] = useState<{ x: number; y: number }[]>([]);

  // アニメーション値
  const [pulseAnim] = useState(() => new Animated.Value(1));
  const [floatingAnim1] = useState(() => new Animated.Value(0));
  const [floatingAnim2] = useState(() => new Animated.Value(0));
  const [floatingAnim3] = useState(() => new Animated.Value(0));
  const [floatingAnim4] = useState(() => new Animated.Value(0));
  const [strobeOpacity] = useState(() => new Animated.Value(0));

  const { squareSize, squareTop, squareLeft } = useMemo(() => {
    const screenWidth = Dimensions.get("window").width;
    const screenHeight = Dimensions.get("window").height;
    const squareSize = Math.min(screenWidth, screenHeight) * 0.85;
    const squareTop = (screenHeight - squareSize) / 2;
    const squareLeft = (screenWidth - squareSize) / 2;
    return { squareSize, squareTop, squareLeft };
  }, []);

  // 爆発エフェクト作成
  const createBurstEffect = useCallback((x: number, y: number) => {
    const newParticles: Particle[] = [];
    const colors = ["#ff00ff", "#00ffff", "#ffff00", "#00ff00", "#ff0080"];

    for (let i = 0; i < 15; i++) {
      const angle = (Math.PI * 2 * i) / 15;
      const velocity = Math.random() * 5 + 3;

      newParticles.push({
        id: ++particleIdCounter,
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 1,
      });
    }

    setParticles((prev) => [...prev, ...newParticles]);

    // パーティクルを一定時間後に削除
    setTimeout(() => {
      setParticles((prev) =>
        prev.filter((p) => !newParticles.some((np) => np.id === p.id)),
      );
    }, 1500);
  }, []);

  // パンレスポンダー（タッチ追跡用）
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt) => {
          const { locationX, locationY } = evt.nativeEvent;
          createBurstEffect(locationX, locationY);
        },
        onPanResponderMove: (evt) => {
          const { locationX, locationY } = evt.nativeEvent;
          setTouches([{ x: locationX, y: locationY }]);
        },
      }),
    [createBurstEffect],
  );

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

    // 浮遊アニメーション
    const floatingAnimation = (anim: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 3000,
            delay,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 3000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ).start();
    };

    floatingAnimation(floatingAnim1, 0);
    floatingAnimation(floatingAnim2, 1000);
    floatingAnimation(floatingAnim3, 2000);
    floatingAnimation(floatingAnim4, 3000);
  }, [floatingAnim1, floatingAnim2, floatingAnim3, floatingAnim4, pulseAnim]);

  // パーティクル定期生成
  useEffect(() => {
    const interval = setInterval(() => {
      const x = Math.random() * screenWidth;
      const particle = {
        id: ++particleIdCounter,
        x,
        y: screenHeight,
        vx: (Math.random() - 0.5) * 2,
        vy: -Math.random() * 5 - 3,
        color: `hsl(${Math.random() * 360}, 100%, 50%)`,
        opacity: 1,
      };

      setParticles((prev) => [...prev, particle]);

      // パーティクルを一定時間後に削除
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== particle.id));
      }, 4000);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // パーティクル位置更新
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((p) => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.vy + 0.1,
          opacity: Math.max(0, p.opacity - 0.01), // フェードアウト
        })),
      );
    }, 16);

    return () => clearInterval(interval);
  }, []);

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
          { compress: 1, format: ImageManipulator.SaveFormat.JPEG },
        );

        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status === "granted") {
          await MediaLibrary.saveToLibraryAsync(cropped.uri);
        }

        // TestPageに遷移
        router.push({
          pathname: "/TestPage" as any,
          params: { capturedImageUri: cropped.uri },
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
          <Image source={{ uri: photoUri }} style={styles.previewImage} />
          <TouchableOpacity
            style={styles.retakeButton}
            onPress={() => setPhotoUri(null)}
          >
            <LinearGradient
              colors={["#ff00ff", "#00ffff"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <Text style={styles.retakeButtonText}>RETAKE</Text>
            </LinearGradient>
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
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <LinearGradient
            colors={["#ff00ff", "#00ffff"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <Text style={styles.permissionButtonText}>許可する</Text>
          </LinearGradient>
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
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* 背景グラデーション */}
      <LinearGradient
        colors={["#1a0033", "#330066", "#660099", "#330066", "#1a0033"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

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
          <Svg width={squareSize} height={squareSize} style={styles.svgFrame}>
            <Circle
              cx={squareSize / 2}
              cy={squareSize / 2}
              r={squareSize / 2 - 10}
              stroke="#ff00ff"
              strokeWidth={3}
              fill="transparent"
              strokeDasharray="10 5"
            />
            <Circle
              cx={squareSize / 2}
              cy={squareSize / 2}
              r={squareSize / 2 - 20}
              stroke="#00ffff"
              strokeWidth={2}
              fill="transparent"
              strokeDasharray="5 10"
            />
          </Svg>
        </View>
      </View>

      {/* 浮遊する絵文字 */}
      <Animated.Text
        style={[
          styles.floatingEmoji,
          { top: "10%", left: "10%" },
          {
            transform: [
              {
                translateY: floatingAnim1.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -30],
                }),
              },
            ],
          },
        ]}
      >
        ✨
      </Animated.Text>

      <Animated.Text
        style={[
          styles.floatingEmoji,
          { top: "15%", right: "10%" },
          {
            transform: [
              {
                translateY: floatingAnim2.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -30],
                }),
              },
            ],
          },
        ]}
      >
        💎
      </Animated.Text>

      <Animated.Text
        style={[
          styles.floatingEmoji,
          { bottom: "20%", left: "10%" },
          {
            transform: [
              {
                translateY: floatingAnim3.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -30],
                }),
              },
            ],
          },
        ]}
      >
        🌟
      </Animated.Text>

      <Animated.Text
        style={[
          styles.floatingEmoji,
          { bottom: "20%", right: "10%" },
          {
            transform: [
              {
                translateY: floatingAnim4.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -30],
                }),
              },
            ],
          },
        ]}
      >
        ⚡
      </Animated.Text>

      {/* パーティクル */}
      {particles.map((particle) => (
        <View
          key={particle.id}
          style={[
            styles.particle,
            {
              left: particle.x,
              top: particle.y,
              backgroundColor: particle.color,
              opacity: particle.opacity,
            },
          ]}
        />
      ))}

      {/* タッチ追従ライト */}
      {touches.map((touch, index) => (
        <View
          key={`touch-${index}-${touch.x}-${touch.y}`}
          style={[
            styles.touchLight,
            {
              left: touch.x - 50,
              top: touch.y - 50,
            },
          ]}
        />
      ))}

      {/* コントロールボタン */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.flipButton}
          onPress={() => setFacing((f) => (f === "back" ? "front" : "back"))}
        >
          <Text style={styles.flipButtonText}>🔄</Text>
        </TouchableOpacity>

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
          style={styles.effectButton}
          onPress={() => setStrobeActive(!strobeActive)}
        >
          <Text style={styles.effectButtonText}>⚡</Text>
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
  permissionButton: {
    borderRadius: 25,
    overflow: "hidden",
  },
  gradientButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
  permissionButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  neonFrame: {
    position: "absolute",
  },
  svgFrame: {
    position: "absolute",
  },
  floatingEmoji: {
    position: "absolute",
    fontSize: 36,
    opacity: 0.7,
  },
  particle: {
    position: "absolute",
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  touchLight: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 0, 0.2)",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 50,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 50,
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
  flipButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  flipButtonText: {
    fontSize: 24,
  },
  effectButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  effectButtonText: {
    fontSize: 24,
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
  },
  retakeButton: {
    marginTop: 30,
    borderRadius: 25,
    overflow: "hidden",
  },
  retakeButtonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal: 40,
    paddingVertical: 15,
  },
});
