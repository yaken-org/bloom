import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle } from "react-native-svg";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function GiraGiraNeon() {
  const [strobeActive, setStrobeActive] = useState(false);
  interface Particle {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    opacity: Animated.Value;
  }

  const [particles, setParticles] = useState<Particle[]>([]);
  const [touches, setTouches] = useState<{ x: number; y: number }[]>([]);

  // アニメーション値
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const textColorAnim = useRef(new Animated.Value(0)).current;
  const bgRotation = useRef(new Animated.Value(0)).current;
  const ringRotation = useRef(new Animated.Value(0)).current;
  const floatingAnim1 = useRef(new Animated.Value(0)).current;
  const floatingAnim2 = useRef(new Animated.Value(0)).current;
  const floatingAnim3 = useRef(new Animated.Value(0)).current;
  const floatingAnim4 = useRef(new Animated.Value(0)).current;

  // パンレスポンダー（タッチ追跡用）
  const panResponder = useRef(
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
  ).current;

  // 爆発エフェクト作成
  const createBurstEffect = useCallback((x: number, y: number) => {
    const newParticles: Particle[] = [];
    const colors = ["#ff00ff", "#00ffff", "#ffff00", "#00ff00", "#ff0080"];

    for (let i = 0; i < 15; i++) {
      const angle = (Math.PI * 2 * i) / 15;
      const velocity = Math.random() * 5 + 3;

      newParticles.push({
        id: Date.now() + i,
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: new Animated.Value(1),
      });
    }

    setParticles((prev) => [...prev, ...newParticles]);

    // パーティクルアニメーション
    newParticles.forEach((particle) => {
      Animated.timing(particle.opacity, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: true,
      }).start(() => {
        setParticles((prev) => prev.filter((p) => p.id !== particle.id));
      });
    });
  }, []);

  // アニメーション初期化
  useEffect(() => {
    // パルスアニメーション
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 500,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // テキストグラデーションアニメーション
    Animated.loop(
      Animated.timing(textColorAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    ).start();

    // 背景回転アニメーション
    Animated.loop(
      Animated.timing(bgRotation, {
        toValue: 1,
        duration: 10000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    // リング回転アニメーション
    Animated.loop(
      Animated.timing(ringRotation, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
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
  }, [
    bgRotation,
    floatingAnim1,
    floatingAnim2,
    floatingAnim3,
    floatingAnim4,
    pulseAnim,
    ringRotation,
    textColorAnim,
  ]);

  // パーティクル定期生成
  useEffect(() => {
    const interval = setInterval(() => {
      const x = Math.random() * screenWidth;
      const particle = {
        id: Date.now(),
        x,
        y: screenHeight,
        vx: (Math.random() - 0.5) * 2,
        vy: -Math.random() * 5 - 3,
        color: `hsl(${Math.random() * 360}, 100%, 50%)`,
        opacity: new Animated.Value(1),
      };

      setParticles((prev) => [...prev, particle]);

      Animated.timing(particle.opacity, {
        toValue: 0,
        duration: 4000,
        useNativeDriver: true,
      }).start(() => {
        setParticles((prev) => prev.filter((p) => p.id !== particle.id));
      });
    }, 300);

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
          vy: p.vy + 0.1, // 重力
        })),
      );
    }, 16);

    return () => clearInterval(interval);
  }, []);

  // ストロボエフェクト
  const strobeOpacity = useRef(new Animated.Value(0)).current;

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

  const toggleStrobe = () => {
    setStrobeActive(!strobeActive);
  };

  const bgRotationStyle = {
    transform: [
      {
        rotate: bgRotation.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "360deg"],
        }),
      },
    ],
  };

  const ringRotationStyle = {
    transform: [
      {
        rotate: ringRotation.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "360deg"],
        }),
      },
    ],
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* 背景アニメーション */}
      <Animated.View style={[styles.bgAnimation, bgRotationStyle]}>
        <LinearGradient
          colors={[
            "#ff00ff",
            "#00ffff",
            "#ffff00",
            "#ff00ff",
            "#00ff00",
            "#ff0080",
            "#0080ff",
            "#ff00ff",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>

      {/* ネオンリング */}
      <Animated.View style={[styles.neonRing, ringRotationStyle]}>
        <Svg width={300} height={300} style={styles.svgRing}>
          <Circle
            cx={150}
            cy={150}
            r={145}
            stroke="#ff00ff"
            strokeWidth={5}
            fill="transparent"
            strokeDasharray="50 20"
          />
          <Circle
            cx={150}
            cy={150}
            r={140}
            stroke="#00ffff"
            strokeWidth={3}
            fill="transparent"
            strokeDasharray="30 30"
          />
        </Svg>
      </Animated.View>

      {/* メインタイトル */}
      <Animated.View
        style={[styles.mainTitle, { transform: [{ scale: pulseAnim }] }]}
      >
        <LinearGradient
          colors={["#ff00ff", "#00ffff", "#ffff00", "#ff00ff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.textGradient}
        >
          <Text style={styles.giraText}>GIRA GIRA</Text>
        </LinearGradient>
      </Animated.View>

      {/* 浮遊する絵文字 */}
      <Animated.Text
        style={[
          styles.floatingEmoji,
          { top: "20%", left: "10%" },
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
          { top: "30%", right: "15%" },
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
          { bottom: "30%", left: "20%" },
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
        ⚡
      </Animated.Text>

      <Animated.Text
        style={[
          styles.floatingEmoji,
          { top: "15%", right: "25%" },
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
        🌟
      </Animated.Text>

      {/* パーティクル */}
      {particles.map((particle) => (
        <Animated.View
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
              left: touch.x - 75,
              top: touch.y - 75,
            },
          ]}
        />
      ))}

      {/* ストロボボタン */}
      <TouchableOpacity style={styles.strobeButton} onPress={toggleStrobe}>
        <LinearGradient
          colors={["#ff00ff", "#00ffff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.strobeButtonGradient}
        >
          <Text style={styles.strobeButtonText}>STROBE MODE</Text>
        </LinearGradient>
      </TouchableOpacity>

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
    overflow: "hidden",
  },
  bgAnimation: {
    position: "absolute",
    width: screenWidth * 2,
    height: screenHeight * 2,
    left: -screenWidth * 0.5,
    top: -screenHeight * 0.5,
    opacity: 0.3,
  },
  neonRing: {
    position: "absolute",
    width: 300,
    height: 300,
    left: (screenWidth - 300) / 2,
    top: (screenHeight - 300) / 2,
  },
  svgRing: {
    position: "absolute",
  },
  mainTitle: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -150 }, { translateY: -50 }],
    width: 300,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  textGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  giraText: {
    fontSize: 48,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
    textShadowColor: "#ff00ff",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  floatingEmoji: {
    position: "absolute",
    fontSize: 48,
  },
  particle: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 3,
    shadowColor: "#ff00ff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  touchLight: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255, 255, 0, 0.3)",
    shadowColor: "#ffff00",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 50,
  },
  strobeButton: {
    position: "absolute",
    bottom: 50,
    left: (screenWidth - 200) / 2,
    width: 200,
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
    elevation: 10,
    shadowColor: "#ff00ff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
  },
  strobeButtonGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  strobeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  strobeEffect: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "white",
  },
});
