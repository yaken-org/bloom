import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Animated, Easing, StyleSheet, View, Dimensions } from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

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

  // ハプティックフィードバック用の関数
  const triggerHapticFeedback = useCallback(
    (style: Haptics.ImpactFeedbackStyle) => {
      if (process.env.EXPO_OS === "ios" || process.env.EXPO_OS === "android") {
        Haptics.impactAsync(style);
      }
    },
    [],
  );

  // より激しい連続振動
  const triggerIntenseHaptic = useCallback(() => {
    if (process.env.EXPO_OS === "ios" || process.env.EXPO_OS === "android") {
      // 連続的な強い振動
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      setTimeout(
        () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
        50,
      );
      setTimeout(
        () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
        100,
      );
    }
  }, []);

  // 超激しい爆発振動パターン
  const triggerExplosiveHaptic = useCallback(() => {
    if (process.env.EXPO_OS === "ios" || process.env.EXPO_OS === "android") {
      // 5連続爆発パターン
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      setTimeout(
        () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
        30,
      );
      setTimeout(
        () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
        60,
      );
      setTimeout(
        () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
        90,
      );
      setTimeout(
        () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
        120,
      );
      setTimeout(
        () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
        150,
      );
    }
  }, []);

  // マシンガン振動パターン
  const triggerMachineGunHaptic = useCallback(() => {
    if (process.env.EXPO_OS === "ios" || process.env.EXPO_OS === "android") {
      for (let i = 0; i < 8; i++) {
        setTimeout(() => {
          Haptics.impactAsync(
            i % 2 === 0
              ? Haptics.ImpactFeedbackStyle.Heavy
              : Haptics.ImpactFeedbackStyle.Medium,
          );
        }, i * 25);
      }
    }
  }, []);

  useEffect(() => {
    // 初期振動 - ローディング開始（マシンガン開始！）
    triggerMachineGunHaptic();

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
    const pulseAnimation = () => {
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
    };

    // パルスアニメーションに同期したハプティックフィードバック（超激しく、頻繁に）
    const hapticPulseTimer = setInterval(() => {
      triggerMachineGunHaptic(); // マシンガン振動に変更
    }, 200); // さらに頻繁に（200msごと）

    // 追加の中間振動でさらに激しく
    const hapticPulseSecondaryTimer = setInterval(() => {
      triggerHapticFeedback(Haptics.ImpactFeedbackStyle.Heavy);
    }, 80); // 80msごとに超頻繁な振動

    // 第3の振動レイヤー追加
    const hapticPulseTertiaryTimer = setInterval(() => {
      triggerHapticFeedback(Haptics.ImpactFeedbackStyle.Medium);
    }, 120); // 120msごとの中間振動

    pulseAnimation();

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
    const explosionAnimation = () => {
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
    };

    // 爆発アニメーションに同期したハプティックフィードバック（爆発的に激しく！）
    const hapticExplosionTimer = setInterval(() => {
      triggerExplosiveHaptic(); // 爆発的な振動パターン
    }, 600); // 0.6秒ごとに爆発

    // スケールアニメーションにも振動を追加
    const hapticScaleTimer = setInterval(() => {
      triggerIntenseHaptic(); // 激しい振動
    }, 250); // 0.25秒ごとにスケール変化に合わせた激しい振動

    // 回転アニメーションにも振動追加（新しい次元！）
    const hapticRotationTimer = setInterval(() => {
      triggerHapticFeedback(Haptics.ImpactFeedbackStyle.Heavy);
    }, 100); // 0.1秒ごとの超高速振動

    // フレア回転にも振動追加
    const hapticFlareTimer = setInterval(() => {
      triggerHapticFeedback(Haptics.ImpactFeedbackStyle.Medium);
    }, 180); // 0.18秒ごとのフレア振動

    // シマーエフェクトにも振動
    const hapticShimmerTimer = setInterval(() => {
      triggerMachineGunHaptic();
    }, 400); // 0.4秒ごとにマシンガン振動

    explosionAnimation();

    const timer = setTimeout(() => {
      // 完了時に究極の爆発振動フィナーレ！！！
      triggerMachineGunHaptic();
      setTimeout(() => triggerExplosiveHaptic(), 100);
      setTimeout(() => triggerMachineGunHaptic(), 300);
      setTimeout(() => triggerExplosiveHaptic(), 500);
      setTimeout(() => triggerIntenseHaptic(), 700);
      setTimeout(() => triggerMachineGunHaptic(), 900);

      router.replace({
        pathname: "/view",
        params: { imageUri: imageUri },
      });
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearInterval(hapticPulseTimer);
      clearInterval(hapticPulseSecondaryTimer);
      clearInterval(hapticPulseTertiaryTimer);
      clearInterval(hapticExplosionTimer);
      clearInterval(hapticScaleTimer);
      clearInterval(hapticRotationTimer);
      clearInterval(hapticFlareTimer);
      clearInterval(hapticShimmerTimer);
    };
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
    triggerExplosiveHaptic,
    triggerHapticFeedback,
    triggerIntenseHaptic, // 初期振動 - ローディング開始（マシンガン開始！）
    triggerMachineGunHaptic,
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

  // 画面サイズに基づくスケールファクター
  const scaleFactorWidth = Math.min(screenWidth / 393, 1); // iPhone 15 Proの幅を基準
  const scaleFactorHeight = Math.min(screenHeight / 852, 1); // iPhone 15 Proの高さを基準
  const scaleFactor = Math.min(scaleFactorWidth, scaleFactorHeight);

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
            transform: [{ scale: scaleFactor }],
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
        <Animated.View style={[styles.textContainer, { transform: [{ scale: pulseAnim }] }]}>
          <Animated.Text
            style={[
              styles.loadingText,
              {
                color: textColor,
              },
            ]}
          >
            あなたにぴったりの
          </Animated.Text>
          <Animated.Text
            style={[
              styles.loadingText,
              {
                color: textColor,
              },
            ]}
          >
            ぎらつきを考えています...
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
  textContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
    maxWidth: screenWidth - 40,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "900",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    letterSpacing: 1,
    textAlign: "center",
    lineHeight: 24,
  },
});
