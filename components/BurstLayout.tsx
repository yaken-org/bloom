import React, { type ReactNode, useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  type GestureResponderEvent,
  StyleSheet,
  View,
} from "react-native";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  opacity: number;
  size: number;
}

interface BurstLayoutProps {
  children: ReactNode;
}

let particleIdCounter = 0;

export default function BurstLayout({ children }: BurstLayoutProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  // 爆発エフェクト作成
  const createBurstEffect = useCallback((x: number, y: number) => {
    console.log("Creating burst effect at:", x, y);
    const newParticles: Particle[] = [];
    const colors = [
      "#ff6b6b",
      "#4ecdc4",
      "#45b7d1",
      "#96ceb4",
      "#ffeaa7",
      "#dda0dd",
      "#98d8c8",
      "#ff9ff3",
      "#54a0ff",
      "#5f27cd",
    ];

    for (let i = 0; i < 15; i++) {
      const angle = (Math.PI * 2 * i) / 15;
      const velocity = Math.random() * 6 + 2;
      const size = 4 + Math.random() * 2;

      newParticles.push({
        id: ++particleIdCounter,
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 1,
        size,
      });
    }

    setParticles((prev) => [...prev, ...newParticles]);

    // パーティクルを一定時間後に削除
    setTimeout(() => {
      setParticles((prev) =>
        prev.filter((p) => !newParticles.some((np) => np.id === p.id)),
      );
    }, 2000);
  }, []);

  // タッチハンドラー（イベントフォーカスを奪わない）
  const handleTouchStart = useCallback(
    (evt: GestureResponderEvent) => {
      const { pageX, pageY } = evt.nativeEvent;
      const screenHeight = Dimensions.get("window").height;

      // 下部150pxは除外（ボタンエリア）
      if (pageY > screenHeight - 150) return;

      createBurstEffect(pageX, pageY);
    },
    [createBurstEffect],
  );

  // パーティクル位置更新
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((p) => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.vy + 0.1, // 重力効果
          opacity: Math.max(0, p.opacity - 0.01), // フェードアウト
        })),
      );
    }, 16);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container} onTouchStart={handleTouchStart}>
      {children}

      {/* パーティクル（ポインターイベントを透過） */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        {particles.map((particle) => (
          <View
            key={particle.id}
            style={[
              styles.particle,
              {
                left: particle.x - particle.size / 2,
                top: particle.y - particle.size / 2,
                width: particle.size,
                height: particle.size,
                borderRadius: particle.size / 2,
                backgroundColor: particle.color,
                opacity: particle.opacity,
                shadowColor: particle.color,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 3,
                elevation: 5,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  particle: {
    position: "absolute",
  },
});
