import { ColorMatrix, Group, Image } from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import type { FilterComponentProps } from "@/types/filters";

/**
 * PachinkoFilter - 赤・金・オレンジ系ギラギラ（最大彩度＆顔認識可能）
 */
const PachinkoFilter: React.FC<FilterComponentProps> = React.memo(
  ({ image, width, height, isBaseLayer = true, options = {} }) => {
    const { opacity = 1.0, intensity = 1.0 } = options;

    // 最大彩度マトリックス（顔がわかる明るさ）
    const pachinkoMatrix = useMemo(() => {
      const s = 6.0 * intensity; // 彩度 6倍
      const b = 2.0; // 明るさはやや高めで顔を認識可能
      return [
        1.2*b + s, 0.5*s, 0.0, 0, 0,   // 赤強化
        0.1*s, 1.1*b + s, 0.2*s, 0, 0, // 緑も少し
        0.0, 0.2*s, 1.0*b + s, 0, 0,   // 青は控えめ
        0, 0, 0, 1, 0,
      ];
    }, [intensity]);

    // ハイライト・グロー感強化
    const glowMatrix = useMemo(() => {
      const i = intensity;
      return [
        2.5*i, 0.3*i, 0.2*i, 0, 0,
        0.2*i, 2.2*i, 0.3*i, 0, 0,
        0.1*i, 0.2*i, 2.0*i, 0, 0,
        0, 0, 0, 1, 0,
      ];
    }, [intensity]);

    return (
      <Group>
        {isBaseLayer && (
          <Image image={image} x={0} y={0} width={width} height={height} fit="cover" />
        )}

        {/* 最大彩度・派手赤オレンジ */}
        <Image image={image} x={0} y={0} width={width} height={height} fit="cover" opacity={opacity}>
          <ColorMatrix matrix={pachinkoMatrix} />
        </Image>

        {/* グロー・ハイライト強化 */}
        <Image
          image={image} x={0} y={0} width={width} height={height} fit="cover"
          opacity={opacity*0.95} blendMode="screen"
        >
          <ColorMatrix matrix={glowMatrix} />
        </Image>
      </Group>
    );
  }
);

PachinkoFilter.displayName = "PachinkoFilter";
export default PachinkoFilter;
