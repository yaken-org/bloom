import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

export default function LoadingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const imageUri = params.imageUri as string;

  const [scaleAnim] = useState(() => new Animated.Value(0.8));
  const [rotateAnim] = useState(() => new Animated.Value(0));
  const [opacityAnim] = useState(() => new Animated.Value(0));
  const [colorAnim] = useState(() => new Animated.Value(0));
  const [flareRotate] = useState(() => new Animated.Value(0));
  const [flareScale] = useState(() => new Animated.Value(1));
  const [pulseAnim] = useState(() => new Animated.Value(1));
  const [shimmerAnim] = useState(() => new Animated.Value(0));
  const [explosionScale] = useState(() => new Animated.Value(0.5));

  useEffect(() => {
    // フェードイン
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // スケールアニメーション（より激しく）
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.5,
          duration: 400,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // 回転アニメーション（より速く）
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    // テキストカラーアニメーション
    Animated.loop(
      Animated.timing(colorAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    ).start();

    // フレア回転アニメーション（逆回転で速く）
    Animated.loop(
      Animated.timing(flareRotate, {
        toValue: -1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    // フレアスケールアニメーション（より大きく）
    Animated.loop(
      Animated.sequence([
        Animated.timing(flareScale, {
          toValue: 1.8,
          duration: 1000,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
        Animated.timing(flareScale, {
          toValue: 0.8,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // パルスアニメーション（新規）
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 300,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // シマーアニメーション（新規）
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    ).start();

    // 爆発的な拡大アニメーション（新規）
    Animated.loop(
      Animated.sequence([
        Animated.timing(explosionScale, {
          toValue: 2,
          duration: 800,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
        Animated.timing(explosionScale, {
          toValue: 0.5,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // TODO(feature-filter): フィルター適用処理実装時にここを修正
    const timer = setTimeout(() => {
      // このページには戻ってほしくないので replace する
      router.replace({
        pathname: "/TestPage",
        params: { imageUri: imageUri },
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [
    router,
    imageUri,
    scaleAnim,
    rotateAnim,
    opacityAnim,
    colorAnim,
    flareRotate,
    flareScale,
    pulseAnim,
    shimmerAnim,
    explosionScale,
  ]);

  const flareSpin = flareRotate.interpolate({
    inputRange: [-1, 0],
    outputRange: ["-360deg", "0deg"],
  });

  const textColor = colorAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: ["#ffff00", "#ff8800", "#ff0000", "#ff4400", "#ffff00"],
  });

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1, 0],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#000000", "#1a0a00", "#331100", "#661100", "#000000"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <Animated.View
        style={[
          styles.loadingContainer,
          {
            opacity: opacityAnim,
          },
        ]}
      >
        {/* 太陽フレアローダー */}
        <View style={styles.sunContainer}>
          {/* 爆発的な外層グロー */}
          <Animated.View
            style={[
              styles.explosionGlow,
              {
                transform: [{ scale: explosionScale }],
                opacity: explosionScale.interpolate({
                  inputRange: [0.5, 2],
                  outputRange: [0.8, 0.1],
                }),
              },
            ]}
          >
            <LinearGradient
              colors={[
                "rgba(255,100,0,0)",
                "rgba(255,150,0,0.3)",
                "rgba(255,200,0,0.5)",
                "rgba(255,255,0,0.7)",
                "rgba(255,200,0,0.5)",
                "rgba(255,150,0,0.3)",
                "rgba(255,100,0,0)",
              ]}
              style={styles.glowGradient}
            />
          </Animated.View>
          {/* 最外層のグロー */}
          <Animated.View
            style={[
              styles.outerGlow,
              {
                transform: [{ scale: flareScale }],
                opacity: opacityAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.6],
                }),
              },
            ]}
          >
            <LinearGradient
              colors={[
                "rgba(255,50,0,0)",
                "rgba(255,100,0,0.3)",
                "rgba(255,200,0,0.6)",
                "rgba(255,255,50,0.8)",
                "rgba(255,200,0,0.6)",
                "rgba(255,100,0,0.3)",
                "rgba(255,50,0,0)",
              ]}
              style={styles.glowGradient}
            />
          </Animated.View>

          {/* 中間のグロー */}
          <Animated.View
            style={[
              styles.middleGlow,
              {
                transform: [{ scale: pulseAnim }],
                opacity: pulseAnim.interpolate({
                  inputRange: [1, 1.3],
                  outputRange: [0.7, 0.9],
                }),
              },
            ]}
          >
            <LinearGradient
              colors={[
                "rgba(255,150,0,0.5)",
                "rgba(255,200,0,0.8)",
                "rgba(255,255,100,1)",
                "rgba(255,200,0,0.8)",
                "rgba(255,150,0,0.5)",
              ]}
              style={styles.glowGradient}
            />
          </Animated.View>

          {/* 放射状のフレア */}
          <Animated.View
            style={[
              styles.flareContainer,
              {
                transform: [{ rotate: flareSpin }],
                opacity: 0.8,
              },
            ]}
          >
            {[...Array(24)].map((_, i) => (
              <Animated.View
                key={`flare-${
                  // biome-ignore lint/suspicious/noArrayIndexKey: for animations
                  i
                }`}
                style={[
                  styles.flareRay,
                  {
                    transform: [
                      { rotate: `${i * 15}deg` },
                      {
                        scaleX: flareScale.interpolate({
                          inputRange: [0.8, 1.8],
                          outputRange: [1.5, 2.5],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <LinearGradient
                  colors={[
                    "rgba(255,255,0,0)",
                    "rgba(255,200,0,0.4)",
                    "rgba(255,150,0,0.8)",
                    "rgba(255,255,255,1)",
                    "rgba(255,150,0,0.8)",
                    "rgba(255,200,0,0.4)",
                    "rgba(255,255,0,0)",
                  ]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.flareGradient}
                />
              </Animated.View>
            ))}
          </Animated.View>

          {/* シマーエフェクト */}
          <Animated.View
            style={[
              styles.shimmerGlow,
              {
                opacity: shimmerOpacity,
                transform: [{ scale: 1.5 }],
              },
            ]}
          >
            <LinearGradient
              colors={[
                "rgba(255,255,255,0)",
                "rgba(255,255,255,0.8)",
                "rgba(255,255,255,0)",
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.glowGradient}
            />
          </Animated.View>

          {/* 内側のグロー */}
          <Animated.View
            style={[
              styles.innerGlow,
              {
                transform: [{ scale: scaleAnim }],
                opacity: 0.9,
              },
            ]}
          >
            <LinearGradient
              colors={[
                "rgba(255,255,200,0.8)",
                "rgba(255,200,0,0.9)",
                "rgba(255,150,0,0.7)",
              ]}
              style={styles.glowGradient}
            />
          </Animated.View>

          {/* コア */}
          <Animated.View
            style={[
              styles.sunCore,
              {
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <LinearGradient
              colors={["#ffffff", "#ffff99", "#ffcc00", "#ff6600"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.sunCoreGradient}
            />
          </Animated.View>
        </View>

        {/* ローディングテキスト */}
        <Animated.View style={[{ transform: [{ scale: pulseAnim }] }]}>
          <Animated.Text
            style={[
              styles.loadingText,
              {
                color: textColor,
              },
            ]}
          >
            あなたにぴったりのぎらつきを考えています...
          </Animated.Text>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  loadingContainer: {
    alignItems: "center",
  },
  sunContainer: {
    width: 300,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  sunCore: {
    width: 60,
    height: 60,
    borderRadius: 30,
    position: "absolute",
    zIndex: 5,
    shadowColor: "#ffaa00",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 40,
    elevation: 15,
  },
  sunCoreGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
  },
  explosionGlow: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    zIndex: 0,
  },
  outerGlow: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    zIndex: 1,
  },
  middleGlow: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    zIndex: 2,
  },
  innerGlow: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    zIndex: 3,
  },
  shimmerGlow: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    zIndex: 4,
  },
  glowGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 150,
  },
  flareContainer: {
    position: "absolute",
    width: 300,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  flareRay: {
    position: "absolute",
    width: 250,
    height: 12,
  },
  flareGradient: {
    width: "100%",
    height: "100%",
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "900",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    letterSpacing: 1,
  },
});
